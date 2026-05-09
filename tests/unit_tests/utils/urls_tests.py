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


def test_modify_url_query_empty_query_appends_param() -> None:
    """Adding a parameter to a URL with no existing query string."""
    test_url = modify_url_query("http://localhost:9000/explore/", standalone="0")
    assert test_url == "http://localhost:9000/explore/?standalone=0"


def test_modify_url_query_empty_query_no_kwargs_is_noop() -> None:
    """A URL with no query string and no kwargs is returned unchanged."""
    test_url = modify_url_query("http://localhost:9000/explore/")
    assert test_url == "http://localhost:9000/explore/"


def test_modify_url_query_preserves_fragment() -> None:
    """Modifying the query string must preserve the URL fragment."""
    test_url = modify_url_query("http://localhost:9000/explore/?x=1#section", x="2")
    assert test_url == "http://localhost:9000/explore/?x=2#section"


def test_modify_url_query_preserves_fragment_when_adding_param() -> None:
    """Adding a new param to a URL with a fragment keeps the fragment intact."""
    test_url = modify_url_query(
        "http://localhost:9000/explore/#section", standalone="0"
    )
    assert test_url == "http://localhost:9000/explore/?standalone=0#section"


def test_modify_url_query_repeated_keys_replaced_by_kwarg() -> None:
    """A repeated query key is collapsed to the value supplied via kwargs."""
    test_url = modify_url_query("http://localhost:9000/?a=1&a=2", a="3")
    assert test_url == "http://localhost:9000/?a=3"


def test_modify_url_query_repeated_keys_collapse_to_first_value() -> None:
    """
    Document current behavior: when a key appears multiple times in the
    incoming URL and is not overridden via kwargs, only the first value is
    retained. This is a regression test guarding against silent changes to
    that behavior.
    """
    test_url = modify_url_query("http://localhost:9000/?a=1&a=2")
    assert test_url == "http://localhost:9000/?a=1"


def test_modify_url_query_preserves_fragment_with_repeated_keys() -> None:
    """Fragment is preserved even when collapsing repeated query keys."""
    test_url = modify_url_query("http://localhost:9000/path/?a=1&a=2&b=3#frag", a="4")
    assert test_url == "http://localhost:9000/path/?a=4&b=3#frag"
