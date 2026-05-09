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
    """Adding a parameter to a URL that has no query string."""
    test_url = modify_url_query("http://localhost:9000/explore/", standalone="0")
    assert test_url == "http://localhost:9000/explore/?standalone=0"


def test_modify_url_query_preserves_fragment() -> None:
    """The URL fragment must survive a query modification."""
    test_url = modify_url_query(
        "http://localhost:9000/explore/?standalone=true#anchor",
        standalone="0",
    )
    assert test_url == "http://localhost:9000/explore/?standalone=0#anchor"


def test_modify_url_query_repeated_keys() -> None:
    """
    Pin current behavior for URLs with repeated query keys.

    ``modify_url_query`` collapses repeated keys to a single occurrence,
    keeping only the first parsed value, while still applying any updates
    requested via kwargs.
    """
    test_url = modify_url_query(
        "http://localhost:9000/explore/?a=1&a=2&b=3",
        b="4",
    )
    assert test_url == "http://localhost:9000/explore/?a=1&b=4"
