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

# Feedback components

Category-level barrel for the **Feedback** component group inside
`@superset-ui/core/components`.

This barrel groups the primitives that surface progress, status, and
empty / placeholder UI to the user. It is a thin re-export layer over
the existing flat barrel — the components themselves continue to live
in their own folders under
`superset-frontend/packages/superset-ui-core/src/components/<Component>`,
and the canonical flat barrel at `components/index.ts` is **not**
modified.

## Usage

```ts
import {
  CachedLabel,
  Empty,
  EmptyState,
  LastUpdated,
  Loading,
  Progress,
  ProgressBar,
  RefreshLabel,
  Result,
  Skeleton,
  Spin,
  WarningIconWithTooltip,
} from '@superset-ui/core/components/groups/feedback';
```

## Members

| Component                 | Public surface                                    | Description                                                              |
| ------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------ |
| `Loading`                 | `Loading`, `LoadingProps`                         | Branded Superset spinner used while content is loading.                  |
| `Skeleton`                | `Skeleton`, `SkeletonProps`                       | Ant Design skeleton placeholders for streaming layouts.                  |
| `Spin`                    | `Spin`                                            | Lightweight Ant Design spinner.                                          |
| `Progress`                | `Progress`, `ProgressProps`                       | Linear / circular progress indicator.                                    |
| `ProgressBar`             | `ProgressBar` (default), `ProgressBarProps`       | Superset-styled progress bar wrapper.                                    |
| `Result`                  | `Result`, `ResultProps`                           | Status result panel (success / error / info).                            |
| `EmptyState`              | `EmptyState`, `EmptyStateProps`                   | Standard Superset empty-state with imagery, title, and description.      |
| `Empty`                   | `Empty`, `EmptyProps`                             | Lower-level empty primitive used to compose richer empty states.         |
| `RefreshLabel`            | `RefreshLabel` (default)                          | Refresh icon button with tooltip — typically paired with `LastUpdated`.  |
| `LastUpdated`             | `LastUpdated`, `LastUpdatedProps`                 | Relative-time label that auto-refreshes ("Updated 2 minutes ago").       |
| `WarningIconWithTooltip`  | `WarningIconWithTooltip` (default)                | Warning icon paired with a markdown tooltip body.                        |
| `CachedLabel`             | `CachedLabel`, `CacheLabelProps`                  | Indicator that a chart or query result was served from cache.            |

The shape of each export mirrors the named exports already published
from `components/index.ts`, or — for components that do not appear in
the flat barrel (`Spin`, `RefreshLabel`, `WarningIconWithTooltip`) —
the export shape declared in the component's own `index.ts` /
`index.tsx`.
