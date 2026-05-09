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

# Selection

Selection: pickers and combo-box style components.

This is a thin barrel that re-exports a curated set of selection-style
components from `@superset-ui/core/components`. It adds no behavior and
introduces no new AntD imports — it exists to give consumers a single
import path for the family of pickers, selects, and combo-boxes used
across Superset.

## Members

The barrel re-exports the public API of the following components:

- [`Select`](../../Select) — primary single/multi-select with async
  loading, virtual scrolling, and tag mode. Also re-exports
  `AsyncSelect`, `RawAntdSelect`, and the related types
  (`SelectProps`, `AsyncSelectProps`, `AsyncSelectRef`,
  `SelectOptionsType`, `SelectOptionsTypePage`,
  `SelectOptionsPagePromise`, `RawAntdSelectProps`).
- [`AutoComplete`](../../AutoComplete) — text input with a suggestion
  dropdown (combo-box). Re-exports `AutoCompleteProps`.
- [`TreeSelect`](../../TreeSelect) — hierarchical select backed by a
  tree of options. Re-exports `TreeSelectProps`.
- [`DatePicker`](../../DatePicker) — date and date-range picker
  (`DatePicker`, `RangePicker`, `DatePickerProps`,
  `RangePickerProps`).
- [`CronPicker`](../../CronPicker) — cron expression builder.
  Re-exports `CronError`.
- [`ColorPicker`](../../ColorPicker) — themeable color picker.
  Re-exports `ColorPickerProps`, `RGBColor`, `ColorValue`.
- [`TimezoneSelector`](../../TimezoneSelector) — IANA timezone select
  with offset-aware sorting. Re-exports `TimezoneSelectorProps`.

## Usage

```ts
import {
  Select,
  AutoComplete,
  TreeSelect,
  DatePicker,
  CronPicker,
  ColorPicker,
  TimezoneSelector,
} from '@superset-ui/core/components/groups/selection';
```

The underlying components are unchanged; importing from this barrel is
equivalent to importing each component from its own module under
`@superset-ui/core/components`.

## Mobile considerations

These components were designed for the web. When evaluating reuse on
mobile platforms (React Native, hybrid shells, or small-viewport web),
keep the following constraints in mind:

- **Virtual scrolling assumptions in `Select`** — `Select` and
  `AsyncSelect` lean on AntD's virtualized list to render large option
  sets efficiently. The virtualization measures rows synchronously
  against the DOM, which assumes a web layout engine. On React Native
  there is no equivalent measurement path; large option lists will
  need a `FlatList`-based replacement, and any callers that pass tens
  of thousands of options should expect to chunk or paginate.
- **Popup positioning (web-only via portals — RN needs bottom
  sheets)** — Dropdowns, date panels, color panels, and the cron
  builder all render their popups through React portals attached to
  `document.body` (or the configured `getPopupContainer`). React
  Native has no DOM portal model; the natural mobile pattern is a
  modal or bottom sheet. Consumers porting these components should
  swap the popup layer rather than try to emulate `position: absolute`
  overlays.
- **Keyboard navigation** — Arrow-key traversal, type-ahead search,
  `Tab`/`Shift+Tab` focus order, and `Enter`/`Escape` semantics are
  all wired through DOM keyboard events. On touch-first surfaces these
  paths are unreachable; ensure search and selection remain usable
  via on-screen affordances (search field, tap-to-select, swipe to
  dismiss) and that screen-reader semantics are preserved.
- **Date locale handling** — `DatePicker`, `CronPicker`, and
  `TimezoneSelector` rely on `dayjs` (with timezone, locale, and the
  cron locale tables) loaded by the host application. Mobile bundles
  often ship a trimmed locale set; verify the active locale and
  timezone database are available before mounting these components,
  and prefer the platform's native pickers when only a date or time
  is required.
