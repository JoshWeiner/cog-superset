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

# Primitives component group

This directory is a category-level barrel that re-exports the foundational,
low-level UI primitives shipped from
`@superset-ui/core/components`. It is intentionally additive: the flat
exports in `../../index.ts` are unchanged, and existing consumers continue
to work.

## Scope

The "primitives" category contains lightweight building blocks used to
compose higher-level Superset UI: layout (`Flex`, `Grid`, `Row`, `Col`,
`Space`, `Divider`), basic content (`Typography`, `Tag`, `Label`, `Badge`,
`Avatar`, `Card`), interactive elements (`Button`, `ButtonGroup`,
`IconButton`, `ActionButton`, `FaveStar`), and shared iconography (`Icons`,
`CertifiedBadge`).

## Dependency policy

This category **must remain free** of the following heavy dependencies. Any
component added to this barrel must not import (transitively or directly)
from:

- `react-ace`
- `ag-grid` (any `ag-grid-*` package, including `@ag-grid-community/*` and `ag-grid-react`)
- `react-markdown`
- `react-draggable`

Components that rely on these libraries (e.g. code editors, data grids,
markdown renderers, draggable widgets) belong in other category barrels and
must not be re-exported from this one.
