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

# `mobile-modules/display`

A small barrel module that groups read-only display / label primitives so
that mobile (and other constrained) bundles can pull them in as a single
unit. The components themselves are unchanged — this barrel is purely a
re-export surface.

## Bundle scope

This bundle is intentionally narrow:

- **Read-only labels and informational components only.** Every member is
  a presentational primitive that renders text, badges, avatars, or links
  from props.
- **No data fetching, no global side effects, no mutable app state.**
  Components in this bundle must not call APIs, dispatch Redux actions,
  read/write `window` / `document`, or own long-lived state.

## Components included

The barrel re-exports the following named symbols (named re-exports
only; default exports of the underlying components are surfaced as
named symbols here):

| Export               | Source                            | Notes                                             |
| -------------------- | --------------------------------- | ------------------------------------------------- |
| `CreatedInfo`        | `src/components/AuditInfo`        | Renders a "created by" tooltip + date span.       |
| `ModifiedInfo`       | `src/components/AuditInfo`        | Renders a "modified by" tooltip + date span.      |
| `AuditInfoProps`     | `src/components/AuditInfo`        | Shared props type for the two `*Info` components. |
| `Descriptions`       | `src/components/Descriptions`     | Re-export of antd's `Descriptions`.               |
| `DescriptionsProps`  | `src/components/Descriptions`     | antd `DescriptionsProps` type.                    |
| `FacePile`           | `src/components/FacePile`         | Avatar group rendered from a list of users.       |
| `FacePileProps`      | `src/components/FacePile`         | Props type for `FacePile`.                        |
| `GenericLink`        | `src/components/GenericLink`      | Internal/external link wrapper.                   |
| `LastQueriedLabel`   | `src/components/LastQueriedLabel` | Formats a last-queried timestamp.                 |
| `RowCountLabel`      | `src/components/RowCountLabel`    | Row-count badge with limit-reached tooltip.       |
| `RowCountLabelProps` | `src/components/RowCountLabel`    | Props type for `RowCountLabel`.                   |

## Known web-only dependencies

The underlying components rely on browser-oriented packages. Consumers
targeting non-web runtimes must shim or substitute these:

- `react-router-dom` — `GenericLink` renders `<Link>` for internal URLs.
- `antd` — `Descriptions` re-exports `antd`'s component directly; other
  members reach antd transitively through `@superset-ui/core/components`
  (`Avatar`, `AvatarGroup`, `Tooltip`, `Label`).
- `@superset-ui/core` feature-flag and color-scheme registries (used by
  `FacePile` to pick avatar colors and to gate avatar URLs).
- `@apache-superset/core/translation` and `@apache-superset/core/theme`
  for `t` / `tn` / `useTheme` / `css`.

These dependencies are read-only in the sense that the components only
read from them — none of the members in this barrel mutate global
state.

## Rule

**Do NOT add components to this bundle that fetch data, call
`window` / `document`, or own mutable app state.** If a component grows
to need any of those, move it out of `mobile-modules/display` rather
than relaxing the rule.
