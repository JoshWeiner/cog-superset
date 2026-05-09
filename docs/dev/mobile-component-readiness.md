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

# Mobile-readiness of `@superset-ui/core` shared components

This document audits every component under
`superset-frontend/packages/superset-ui-core/src/components/` for
mobile-portability. It is meant to be a foundational reference for follow-up
work that picks which components are safe to expose through mobile-eligible
barrels.

## Methodology

The audit is purely static and relied on two checks:

1. A grep across `*.ts`/`*.tsx` files inside
   `superset-frontend/packages/superset-ui-core/src/components/` for the
   patterns:

   ```text
   from 'react-dom'
   document.
   window.
   navigator.
   localStorage
   sessionStorage
   ```

2. A cross-check of
   `superset-frontend/packages/superset-ui-core/package.json` for known
   web-only libraries: `react-ace`, `ag-grid-react`, `ag-grid-community`,
   `react-draggable`, `re-resizable`, `react-resize-detector`,
   `react-markdown`, `react-syntax-highlighter`, `ace-builds`, `brace`,
   `dompurify`, `handlebars`, `xss`.

Test files (`*.test.ts`/`*.test.tsx`) and Storybook stories
(`*.stories.tsx`) are intentionally excluded from the verdict because
they are not shipped with the component bundle. They may, however, be
mentioned in the notes when they are the only place a pattern shows
up.

No component code was modified by this work.

### Tags

| Tag                  | Meaning                                                                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `portable`           | No web-only globals or web-only deps in the production bundle. Safe to surface from a mobile-eligible barrel as-is.                                                                  |
| `portable-with-shim` | Production code touches a web-only global or a web-only dep that has a small, well-scoped equivalent on mobile (e.g. swap `react-resize-detector` for an `onLayout`/observer shim).  |
| `desktop-only`       | Pulls in a desktop-class library (Ace, ag-Grid, react-syntax-highlighter, react-markdown) or relies on mouse-driven UX (resizable/draggable modal). Should NOT enter mobile barrels. |

### Categories

The seven categories used below are an organizational grouping driven
by what each component does in the design system and are not derived
from any source attribute on the components:

- **Primitives** &mdash; foundational UI atoms (typography, layout,
  buttons, badges, icons, theme provider, async wrapper).
- **FormInputs** &mdash; inputs and pickers that capture user values
  in a form context.
- **Feedback** &mdash; status, progress, empty/loading/error
  affordances.
- **Overlays** &mdash; modals, drawers, tooltips, popovers and other
  layered surfaces.
- **Navigation** &mdash; menus, tabs, breadcrumbs, pagination and
  related "where am I / where do I go" affordances.
- **DataDisplay** &mdash; tables, trees, lists, metadata views and
  collapsible content.
- **DesktopOnly** &mdash; components that ship with a desktop-class
  dependency or interaction model and are not mobile-eligible.

## Audit table

| component | category | tag | notes |
| --- | --- | --- | --- |
| ActionButton | Primitives | portable | No web-only globals or deps in production. |
| AntdThemeProvider | Primitives | portable | Pure context provider; no web-only globals. |
| AsyncAceEditor | DesktopOnly | desktop-only | Depends on `react-ace`, `ace-builds`, `brace`, and `dompurify`; production code uses `document.body.contains`/`document.querySelector` to manage the Ace autocomplete popup. |
| AsyncEsmComponent | Primitives | portable | Dynamic-import wrapper around React; no web-only globals or deps. |
| AutoComplete | FormInputs | portable | antd-only; the only `document.body` reference is in the story file. |
| Avatar | Primitives | portable | antd-only. |
| Badge | Primitives | portable | antd-only. |
| Breadcrumb | Navigation | portable | antd-only. |
| Button | Primitives | portable | antd-only. |
| ButtonGroup | Primitives | portable | antd-only. |
| CachedLabel | Feedback | portable | Pure presentational label. |
| Card | Primitives | portable | antd-only. |
| CertifiedBadge | Primitives | portable | Icon + tooltip; no web-only globals. |
| Checkbox | FormInputs | portable | antd-only. |
| CodeEditor | DesktopOnly | desktop-only | Depends on `react-ace` and `ace-builds` mode bundles (sql/json/markdown/handlebars/htmlbars). |
| CodeSyntaxHighlighter | DesktopOnly | desktop-only | Depends on `react-syntax-highlighter` (heavy web bundle with hljs styles and language imports). |
| Collapse | DataDisplay | portable | antd-only. |
| ColorPicker | FormInputs | portable | antd-only. |
| ConfirmModal | Overlays | portable-with-shim | Built on `Modal`; inherits its `re-resizable`/`react-draggable`/`document.documentElement` caveats. |
| ConfirmStatusChange | FormInputs | portable | Wrapper around a confirm flow; no web-only globals. |
| CronPicker | FormInputs | portable | Uses `react-js-cron`; no web-only globals matched by the grep. |
| DatePicker | FormInputs | portable | antd-only. |
| DeleteModal | Overlays | portable-with-shim | Built on `Modal`; inherits its caveats. |
| Divider | Primitives | portable | antd-only. |
| Drawer | Overlays | portable | antd-only. |
| Dropdown | Navigation | portable | antd-only. |
| DropdownButton | Navigation | portable | antd-only. |
| DropdownContainer | Navigation | portable-with-shim | Imports `react-resize-detector` and assigns `document.onscroll` while a popover is open. |
| DynamicEditableTitle | FormInputs | portable-with-shim | Imports `react-resize-detector` for layout-driven width tracking. |
| EditableTitle | FormInputs | portable-with-shim | Uses `document.createElement('canvas')` and `window.getComputedStyle(...)` to measure text width. |
| EmptyState | Feedback | portable | The `document.svg` matches refer to an asset filename, not a DOM API. |
| FaveStar | FormInputs | portable | Toggle button; no web-only globals. |
| Flex | Primitives | portable | antd-only. |
| Form | FormInputs | portable-with-shim | `LabeledErrorBoundInput.tsx` calls `window.open(get_url)` to open a help link. |
| Grid | Primitives | portable | antd-only. |
| IconButton | Primitives | portable | No web-only globals or deps. |
| IconTooltip | Overlays | portable | antd-only. |
| Icons | Primitives | portable | Icon registry; no web-only globals. |
| Image | Primitives | portable | Plain `<img>` wrapper; no web-only globals. |
| InfoTooltip | Overlays | portable | antd-only. |
| Input | FormInputs | portable | antd-only. |
| Label | Primitives | portable | antd-only. |
| LastUpdated | Feedback | portable | Renders relative time; no web-only globals. |
| Layout | Primitives | portable | antd-only. |
| List | DataDisplay | portable | antd-only. |
| ListViewCard | DataDisplay | portable | Card composition; no web-only globals. |
| Loading | Feedback | portable | Spin wrapper; no web-only globals. |
| Menu | Navigation | portable | antd-only. |
| Metadata | DataDisplay | portable | Presentational metadata block. |
| MetadataBar | DataDisplay | portable-with-shim | Imports `react-resize-detector` to switch between vertical/horizontal layouts. |
| Modal | Overlays | portable-with-shim | Imports `re-resizable` and `react-draggable`; reads `document.documentElement.{clientWidth,clientHeight}` to clamp drag/resize bounds. Disabling resizable/draggable on mobile makes the rest of the component portable. |
| ModalTrigger | Overlays | portable-with-shim | Built on `Modal`; inherits its caveats. |
| PageHeaderWithActions | Navigation | portable | Composition of antd primitives; no web-only globals. |
| Pagination | Navigation | portable | Wrapper around `react-ultimate-pagination`; not in the web-only dep list and no web-only globals matched. |
| Popconfirm | Overlays | portable | antd-only. |
| Popover | Overlays | portable | antd-only. |
| PopoverDropdown | Overlays | portable | antd-only. |
| PopoverSection | Overlays | portable | antd-only. |
| Progress | Feedback | portable | antd-only. |
| ProgressBar | Feedback | portable | antd-only. |
| Radio | FormInputs | portable | antd-only. |
| RefreshLabel | Feedback | portable | Icon + label; no web-only globals. |
| Result | Feedback | portable | antd-only. |
| SafeMarkdown | DesktopOnly | desktop-only | Dynamically imports `react-markdown` plus `rehype-raw`/`rehype-sanitize`/`remark-gfm`; the renderer targets the DOM and is not React Native&ndash;portable. |
| Select | FormInputs | portable | antd-only in production; the `document.querySelector` matches are confined to the test files. |
| Skeleton | Feedback | portable | antd-only. |
| Slider | FormInputs | portable | antd-only. |
| Space | Primitives | portable | antd-only. |
| Spin | Feedback | portable | antd-only; the `document.querySelector` match is in the test file. |
| Steps | Navigation | portable | antd-only. |
| Switch | FormInputs | portable | antd-only. |
| Table | DataDisplay | portable-with-shim | `VirtualTable.tsx` imports `react-resize-detector`; `utils/InteractiveTableUtils.ts` registers `document.addEventListener('mouseup', ...)` for column-drag-resize. |
| TableCollection | DataDisplay | portable | `react-table` based composition; no web-only globals. |
| TableView | DataDisplay | portable-with-shim | Calls `window.scrollTo({ top: 0, behavior: 'smooth' })` on page change (already guarded with `typeof window !== 'undefined'`). |
| Tabs | Navigation | portable | antd-only; the `window.getComputedStyle` match is in the test file. |
| Tag | Primitives | portable | antd-only. |
| TelemetryPixel | Feedback | portable | Renders a 1&times;1 `<img>`; no web-only globals in production. |
| ThemedAgGridReact | DesktopOnly | desktop-only | Depends on `ag-grid-react` and `ag-grid-community` (and registers AG Grid modules at import time). |
| Timer | Feedback | portable | Renders a formatted duration; no web-only globals. |
| TimezoneSelector | FormInputs | portable | antd-only in production; `document.querySelectorAll` matches are in the test files. |
| Tooltip | Overlays | portable | antd-only. |
| TooltipParagraph | Overlays | portable | antd-only. |
| Tree | DataDisplay | portable | antd-only. |
| TreeSelect | FormInputs | portable | antd-only. |
| TruncatedList | DataDisplay | portable | Presentational list; no web-only globals. |
| Typography | Primitives | portable | antd-only; the `document` match is a string in the story file. |
| UnsavedChangesModal | Overlays | portable-with-shim | Built on `Modal`; inherits its caveats. |
| Upload | FormInputs | portable | antd-only. |
| WarningIconWithTooltip | Feedback | portable | Icon + tooltip; no web-only globals. |

## Summary

- **Desktop-only (5):** `AsyncAceEditor`, `CodeEditor`,
  `CodeSyntaxHighlighter`, `SafeMarkdown`, `ThemedAgGridReact`.
- **Portable-with-shim (12):** `ConfirmModal`, `DeleteModal`,
  `DropdownContainer`, `DynamicEditableTitle`, `EditableTitle`, `Form`,
  `MetadataBar`, `Modal`, `ModalTrigger`, `Table`, `TableView`,
  `UnsavedChangesModal`.
- **Portable (everything else).**

### Reusable shims worth building first

A small number of dependencies and globals account for almost every
`portable-with-shim` row, so a future mobile barrel should plan
shims/replacements in this order of leverage:

1. `react-resize-detector` &rarr; abstract a `useElementSize` hook
   that maps to a native layout API on mobile and to
   `react-resize-detector`/`ResizeObserver` on web. Unblocks
   `DropdownContainer`, `DynamicEditableTitle`, `MetadataBar`, and
   `Table` (`VirtualTable`).
2. Modal interactions &rarr; gate `re-resizable` and `react-draggable`
   behind a `resizable && draggable` prop that defaults to `false` on
   mobile; the `document.documentElement` read is only used to clamp
   drag/resize bounds. Unblocks `Modal`, `ConfirmModal`,
   `DeleteModal`, `ModalTrigger`, `UnsavedChangesModal`.
3. Text-measurement in `EditableTitle` &rarr; replace the
   `document.createElement('canvas')` + `window.getComputedStyle`
   width measurement with a layout-driven approach (e.g. measure with
   `onLayout` or a hidden `<Text>` shim).
4. `Form/LabeledErrorBoundInput` &rarr; abstract `window.open` behind
   a platform `openLink(url)` helper.
5. `TableView` &rarr; replace `window.scrollTo` with a ref-based
   scroll-to-top via the table container; the existing `typeof
   window` guard already prevents SSR crashes but the call itself is
   web-only.
6. `Table/InteractiveTableUtils` &rarr; replace
   `document.addEventListener('mouseup', ...)` with React pointer
   events on the column handle.
