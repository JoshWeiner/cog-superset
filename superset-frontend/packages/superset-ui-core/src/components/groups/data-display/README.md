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

# Data Display component group

Category-level barrel for components in
`@superset-ui/core/components` that render or organize data for the
viewer: tables, lists, metadata blocks, collapsible regions, images,
timers, markdown, and telemetry pixels.

## Usage

```ts
import {
  Table,
  TableView,
  TableCollection,
  List,
  ListViewCard,
  Tree,
  MetadataBar,
  Collapse,
  Image,
  TruncatedList,
  Timer,
  SafeMarkdown,
  TelemetryPixel,
} from '@superset-ui/core/components/groups/data-display';
```

The names and paths mirror the existing flat barrel at
`superset-frontend/packages/superset-ui-core/src/components/index.ts`.
The flat barrel is intentionally left untouched; this group is
additive and exists to make data-display imports more discoverable.

## Included components

| Export | Source |
| --- | --- |
| `Table` (export *) | `../../Table` |
| `TableView` (export *) | `../../TableView` |
| `TableCollection` (default re-exported from its folder) | `../../TableCollection` |
| `List`, `ListProps`, `ListItemProps` | `../../List` |
| `ListViewCard`, `ImageLoader`, `ListViewCardProps` | `../../ListViewCard` |
| `Tree` (default), `TreeProps`, `TreeDataNode` | `../../Tree` |
| `Metadata`, `MetadataProps` (re-exported from its folder) | `../../Metadata` |
| `MetadataBar` (default), `MetadataBarProps` | `../../MetadataBar` |
| `Collapse`, `CollapseProps`, `CollapseLabelInModal`, `CollapseLabelInModalProps` | `../../Collapse` |
| `Image`, `ImageProps` | `../../Image` |
| `TruncatedList`, `TruncatedListProps` (re-exported from its folder) | `../../TruncatedList` |
| `Timer` (export *) | `../../Timer` |
| `SafeMarkdown` (export *) | `../../SafeMarkdown/SafeMarkdown` |
| `TelemetryPixel` (export *) | `../../TelemetryPixel` |

## ⚠️ Mobile portability caveat: ag-grid

`Table` and `TableView` re-exported from this barrel transitively pull
in [`ag-grid`][ag-grid] via the
`ThemedAgGridReact` wrapper in
`@superset-ui/core/components/ThemedAgGridReact`.

Consumers that target mobile or other environments where ag-grid is
not portable (bundle size, licensing, or runtime constraints) should
either:

- import the leaner primitives they need directly from their source
  modules instead of the group barrel, or
- gate usage of `Table` / `TableView` behind a code-split boundary so
  ag-grid is only loaded where it is actually needed.

[ag-grid]: https://www.ag-grid.com/
