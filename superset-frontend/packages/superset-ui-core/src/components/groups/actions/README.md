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

# Actions

Actions: trigger user-initiated commands.

This barrel groups the components a UI uses to invite the user to perform
a discrete action — primary calls to action, icon affordances, grouped
button rows, and dropdown-driven menus. It re-exports the existing
`@superset-ui/core` components without modifying them, providing a stable
import surface for downstream targets (in particular mobile-facing
shells) that want to consume only the action-oriented building blocks.

## Members

- `Button` — primary action component; supports `primary` / `secondary` /
  `tertiary` / `danger` / `link` / `dashed` styles, sizing, optional
  tooltip, and an optional anchor (`href`) form.
- `ButtonGroup` — visually joins a row of `Button`s with shared edges
  and an optional `expand` flag for full-width layouts.
- `IconButton` — large card-style action with an icon (or default
  database icon) and a label; uses `Card` semantics under the hood.
- `ActionButton` — compact icon-only affordance (e.g. table row
  actions) with an optional tooltip.
- `DropdownButton` — split button that exposes a primary action plus a
  popup menu, with optional tooltip and tooltip placement.

## Mobile considerations

These components were built for the AntD-based desktop web shell. When
consuming them in a mobile-facing target, be aware that several props
are AntD- or web-bound and may not translate cleanly:

- `tooltip` / `placement` / `tooltipPlacement` — render through AntD's
  `Tooltip`, which assumes hover and pointer-style positioning. Mobile
  surfaces typically lack hover and may need to suppress these or map
  them to a tap-driven equivalent.
- `href` on `Button` — emits a real `<a>` anchor via AntD, which is
  fine on the web but bypasses any in-app navigation stack on native
  shells. Prefer `onClick` with the host router on mobile.
- Hover-only secondary styles — `Button`'s `secondary` variant and
  `ActionButton` rely on `:hover` / `:active` CSS pseudo-classes for
  their interactive states. On touch devices these states are
  effectively unreachable; treat the resting style as the primary
  visual.
- `IconButton` — extends AntD `Card` (`hoverable`) and is keyboard /
  pointer oriented; touch targets and the hover lift may need to be
  re-tuned for small viewports.
- `DropdownButton` — wraps AntD `Dropdown.Button`, whose popup
  positioning and dismissal semantics are tuned for desktop.

This group adds no behavior of its own — the underlying components are
unchanged — so any mobile adaptation should happen in the consuming
shell rather than here.

## Example

```ts
import { Button, IconButton } from '@superset-ui/core/components/groups/actions';
```
