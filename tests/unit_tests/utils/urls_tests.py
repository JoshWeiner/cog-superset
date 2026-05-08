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


def test_modify_url_query_with_empty_query() -> None:
    """A URL with no existing query string should get the new parameter appended."""
    test_url = modify_url_query("http://localhost:9000/explore/", standalone="1")
    assert test_url == "http://localhost:9000/explore/?standalone=1"


def test_modify_url_query_preserves_fragment() -> None:
    """The URL fragment should be preserved when modifying query parameters."""
    test_url = modify_url_query(
        "http://localhost:9000/superset/dashboard/3/?standalone=3#section",
        standalone="0",
    )
    assert (
        test_url == "http://localhost:9000/superset/dashboard/3/?standalone=0#section"
    )


def test_modify_url_query_with_fragment_and_no_query() -> None:
    """A URL with a fragment but no query string should add the query and keep the
    fragment."""
    test_url = modify_url_query(
        "http://localhost:9000/explore/#section", standalone="1"
    )
    assert test_url == "http://localhost:9000/explore/?standalone=1#section"


def test_modify_url_query_with_repeated_keys_not_overwritten() -> None:
    """Repeated query keys that are not part of the kwargs collapse to their first
    value because ``modify_url_query`` only emits ``v[0]`` per key. This regression
    test pins the current (lossy) behavior."""
    test_url = modify_url_query(
        "http://localhost:9000/path?tag=a&tag=b", standalone="1"
    )
    assert test_url == "http://localhost:9000/path?tag=a&standalone=1"


def test_modify_url_query_overwrites_repeated_keys() -> None:
    """When the kwargs explicitly target a key that appears multiple times, the new
    value should fully replace any prior occurrences."""
    test_url = modify_url_query("http://localhost:9000/path?tag=a&tag=b", tag="c")
    assert test_url == "http://localhost:9000/path?tag=c"
