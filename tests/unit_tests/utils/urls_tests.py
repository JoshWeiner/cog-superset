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


def test_modify_url_query_empty_query() -> None:
    """Adding a parameter to a URL that has no query string appends it correctly."""
    test_url = modify_url_query("http://localhost:9000/path", standalone="0")
    assert test_url == "http://localhost:9000/path?standalone=0"


def test_modify_url_query_no_kwargs_preserves_query() -> None:
    """Calling without kwargs leaves existing single-valued query params intact."""
    test_url = modify_url_query("http://localhost:9000/path?a=1&b=2")
    assert test_url == "http://localhost:9000/path?a=1&b=2"


def test_modify_url_query_preserves_fragment() -> None:
    """Fragments must survive a query rewrite (regression for fragment handling)."""
    test_url = modify_url_query(
        "http://localhost:9000/path?a=1#section", standalone="0"
    )
    assert test_url == "http://localhost:9000/path?a=1&standalone=0#section"


def test_modify_url_query_preserves_fragment_with_empty_query() -> None:
    """Fragments must survive even when the input URL has no query string."""
    test_url = modify_url_query("http://localhost:9000/path#section", standalone="0")
    assert test_url == "http://localhost:9000/path?standalone=0#section"


def test_modify_url_query_repeated_keys_collapses_to_first() -> None:
    """Documents the existing behavior: repeated query keys collapse to the
    first value when the URL is rewritten, even if the caller did not override
    that key. This is a regression guard against silent changes to how the
    function handles repeated keys."""
    test_url = modify_url_query("http://localhost:9000/path?a=1&a=2", standalone="0")
    assert test_url == "http://localhost:9000/path?a=1&standalone=0"


def test_modify_url_query_list_value_uses_first_element() -> None:
    """Documents the existing behavior: when a caller passes a list value,
    only the first element is rendered into the resulting query string."""
    test_url = modify_url_query("http://localhost:9000/path", a=["1", "2"])
    assert test_url == "http://localhost:9000/path?a=1"
