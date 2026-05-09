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
    """A URL with no existing query string should gain the new parameter."""
    test_url = modify_url_query("http://localhost:9000/explore/", standalone="0")
    assert test_url == "http://localhost:9000/explore/?standalone=0"


def test_modify_url_query_preserves_fragment() -> None:
    """Fragments must be preserved when query parameters are modified."""
    test_url = modify_url_query("http://localhost:9000/path?foo=1#section", foo="2")
    assert test_url == "http://localhost:9000/path?foo=2#section"


def test_modify_url_query_fragment_with_empty_query() -> None:
    """Fragments must be preserved even when the original URL has no query."""
    test_url = modify_url_query("http://localhost:9000/path#section", foo="1")
    assert test_url == "http://localhost:9000/path?foo=1#section"


def test_modify_url_query_overrides_repeated_keys() -> None:
    """When a key appears multiple times in the original URL, the kwarg
    override fully replaces all occurrences with the new value."""
    test_url = modify_url_query("http://localhost:9000/path?foo=1&foo=2", foo="3")
    assert test_url == "http://localhost:9000/path?foo=3"


def test_modify_url_query_quotes_special_characters() -> None:
    """Values containing characters that require URL encoding are quoted."""
    test_url = modify_url_query("http://localhost:9000/path", q="hello world")
    assert test_url == "http://localhost:9000/path?q=hello%20world"
