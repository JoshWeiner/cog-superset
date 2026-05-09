<!--
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
-->
# Contributing to Apache Superset

Contributions are welcome and are greatly appreciated! Every
little bit helps, and credit will always be given.

## Developer Portal

All developer and contribution documentation has moved to the Apache Superset Developer Portal:

**[📚 View the Developer Portal →](https://superset.apache.org/developer_portal/)**

The Developer Portal includes comprehensive guides for:
- [Contributing Overview](https://superset.apache.org/developer_portal/contributing/overview)
- [Development Setup](https://superset.apache.org/developer_portal/contributing/development-setup)
- [Submitting Pull Requests](https://superset.apache.org/developer_portal/contributing/submitting-pr)
- [Contribution Guidelines](https://superset.apache.org/developer_portal/contributing/guidelines)
- [Code Review Process](https://superset.apache.org/developer_portal/contributing/code-review)
- [Development How-tos](https://superset.apache.org/developer_portal/contributing/howtos)

Source for the Developer Portal documentation is [located here](https://github.com/apache/superset/tree/master/docs/developer_portal).

## Running targeted tests

When you change a single backend or frontend module, prefer running only the
tests for that module instead of the full suite. The commands below cover the
most useful targeted invocations; `AGENTS.md` lists additional variants.

### Backend (pytest)

Run the unit tests for a single Python module by passing the matching test path
to `pytest`. For example, the unit tests that mirror `superset/charts/` live in
`tests/unit_tests/charts/`:

```bash
# Whole module
pytest tests/unit_tests/charts/

# Single file
pytest tests/unit_tests/charts/test_schemas.py

# Single test (node id)
pytest tests/unit_tests/charts/test_schemas.py::test_get_time_grain_choices
```

`pytest.ini` sets `testpaths = tests`, so paths are relative to the repository
root. Integration tests under `tests/integration_tests/` follow the same
pattern but require a configured test database.

### Frontend (Jest)

The frontend monorepo lives in `superset-frontend/`. Run Jest against a single
test file by passing its path after `--`:

```bash
cd superset-frontend

# Single file
npm run test -- src/filters/components/Range/RangeFilterPlugin.test.tsx

# All tests in a directory (path is treated as a regex by Jest)
npm run test -- src/filters/components/Range/
```

The `test` script in `superset-frontend/package.json` invokes Jest directly, so
any extra flags are forwarded to Jest (for example `--watch` or
`-t "renders correctly"`).
