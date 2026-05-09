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

from superset.utils.urls import modify_url_query

EXPLORE_CHART_LINK = "http://localhost:9000/explore/?form_data=%7B%22slice_id%22%3A+76%7D&standalone=true&force=false"

EXPLORE_DASHBOARD_LINK = "http://localhost:9000/superset/dashboard/3/?standalone=3"


def test_convert_chart_link() -> None:
    test_url = modify_url_query(EXPLORE_CHART_LINK, standalone="0")
    assert (
        test_url
        == "http://localhost:9000/explore/?form_data=%7B%22slice_id%22%3A%2076%7D&standalone=0&force=false"
    )


def test_convert_dashboard_link() -> None:
    test_url = modify_url_query(EXPLORE_DASHBOARD_LINK, standalone="0")
    assert test_url == "http://localhost:9000/superset/dashboard/3/?standalone=0"


def test_convert_dashboard_link_with_integer() -> None:
    test_url = modify_url_query(EXPLORE_DASHBOARD_LINK, standalone=0)
    assert test_url == "http://localhost:9000/superset/dashboard/3/?standalone=0"


def test_modify_url_query_empty_query_string() -> None:
    """Adding a parameter to a URL that has no existing query string."""
    test_url = modify_url_query("http://localhost:9000/explore/", standalone="0")
    assert test_url == "http://localhost:9000/explore/?standalone=0"


def test_modify_url_query_no_kwargs_preserves_url() -> None:
    """Calling without kwargs leaves a URL with no query string unchanged."""
    test_url = modify_url_query("http://localhost:9000/explore/")
    assert test_url == "http://localhost:9000/explore/"


def test_modify_url_query_preserves_fragment() -> None:
    """Modifying the query string must not drop the URL fragment."""
    test_url = modify_url_query(
        "http://localhost:9000/explore/?standalone=1#section",
        standalone="0",
    )
    assert test_url == "http://localhost:9000/explore/?standalone=0#section"


def test_modify_url_query_repeated_keys_collapses_to_first_value() -> None:
    """
    Documents existing behavior: when the original URL repeats a key, only
    the first occurrence is preserved because the implementation emits a
    single ``v[0]`` per key when rebuilding the query string.
    """
    test_url = modify_url_query(
        "http://localhost:9000/explore/?a=1&a=2",
        b="3",
    )
    assert test_url == "http://localhost:9000/explore/?a=1&b=3"


def test_modify_url_query_quotes_special_characters() -> None:
    """Values containing reserved characters must be percent-encoded."""
    test_url = modify_url_query(
        "http://localhost:9000/explore/",
        q="a b&c",
    )
    assert test_url == "http://localhost:9000/explore/?q=a%20b%26c"
