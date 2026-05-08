# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
"""Tests for endpoints declared on superset.views.core.Superset."""

from typing import Any

from pytest_mock import MockerFixture


def test_language_pack_is_anonymously_accessible(
    client: Any,
    mocker: MockerFixture,
) -> None:
    """The /superset/language_pack/<lang>/ endpoint must be reachable
    without authentication so embedded dashboards (loaded with a guest
    token) and the pre-login bootstrap can fetch translations.

    Regression test for upstream apache/superset#39882.
    """
    # Pretend the locale's compiled messages.json file exists on disk so
    # we exercise the success path without depending on a build step.
    mocker.patch("superset.views.core.os.path.isfile", return_value=True)
    mocker.patch(
        "superset.views.core.send_file",
        return_value=("{}", 200, {"Content-Type": "application/json"}),
    )

    # No login / no full_api_access fixture: this is an anonymous request.
    response = client.get("/superset/language_pack/fr/")

    # The endpoint must not redirect to the login page (302) nor reject
    # the caller (401/403).  Most importantly, it must not bounce to the
    # login form, which is what a guest in an embedded dashboard would hit.
    assert response.status_code == 200, (
        f"Expected 200 OK for anonymous request, got {response.status_code} "
        f"(location={response.headers.get('Location')!r}); the language_pack "
        "endpoint must remain reachable without authentication."
    )
    assert response.status_code != 302
    assert response.headers.get("Location") is None


def test_language_pack_rejects_invalid_locale(client: Any) -> None:
    """Locale path parameter is still validated as a defensive measure."""
    response = client.get("/superset/language_pack/..%2Fetc/")

    # Bad locales must not leak files or hit the filesystem; they should
    # never short-circuit into a redirect to the login page either.
    assert response.status_code in (400, 404)
    assert response.headers.get("Location") is None


def test_language_pack_unknown_locale_returns_404(
    client: Any,
    mocker: MockerFixture,
) -> None:
    """Well-formed but unknown locales return 404 rather than auth errors."""
    mocker.patch("superset.views.core.os.path.isfile", return_value=False)

    response = client.get("/superset/language_pack/zz/")

    assert response.status_code == 404
    assert response.headers.get("Location") is None
