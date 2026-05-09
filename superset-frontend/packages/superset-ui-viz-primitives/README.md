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

## @superset-ui/viz-primitives

Portable visualization primitives for Superset that can be consumed by mobile,
embedded, and other non-DOM contexts in addition to the standard web frontend.

### Portability contract

This package intentionally has a narrow, portable runtime surface. The
following are **not** allowed as runtime or peer dependencies:

- `react` / `react-dom`
- `@emotion/*`
- `antd` / `@ant-design/*`
- `@apache-superset/core` (and any subpath)

Runtime dependencies are limited to small, well-isolated utilities such as the
`d3-*` family, `lodash`, `seedrandom`, and the standard Babel/`core-js` runtime
helpers. Tests run under `testEnvironment: 'node'` (no `jsdom`) and the
TypeScript `lib` is restricted to `ES2020` (no `DOM`) to enforce this contract
at type-check time.

The intent is that downstream Superset packages can depend on
`@superset-ui/viz-primitives` from environments where a browser DOM and React
runtime are unavailable — for example, native mobile shells or embedded
analytics surfaces — without pulling the full Superset frontend into the
bundle.

### Extraction plan

This package is being populated incrementally. See
[docs/architecture/viz-primitives-extraction.md](../../../docs/architecture/viz-primitives-extraction.md)
for the staged plan that moves color, format, time, validator, dimension,
query, and chart-types/echarts-utils leaves out of `@superset-ui/core` and into
this package, along with the CI guardrails that keep the portability contract
enforced.
