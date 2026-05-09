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

# `@superset-ui/core/components` Mobile Inventory

This document is a static audit of every immediate subdirectory of
`superset-frontend/packages/superset-ui-core/src/components/`. It is the
input for the upcoming mobile-modularization effort: each component is
placed into exactly one mobile-oriented group and tagged with a
`mobile_readiness` value so that follow-up PRs can mechanically generate
per-group barrel files (`components/groups/<category>/index.ts`) without
having to re-discover this metadata.

This file is **docs only** — it does not move, rename, or modify any
component source. No `groups/` directory is created in this PR.

## Conventions used in this inventory

- **Component** — the immediate subdirectory name under `components/`
  (or, in a few cases, a top-level file such as `DesignSystem.stories.tsx`).
- **Public exports** — the named/default exports surfaced by the
  component's `index.tsx` / `index.ts` (or its primary `*.tsx` file when
  no `index` exists). Type-only exports are listed alongside value
  exports for completeness.
- **AntD** — `Y` if any file inside the component directory directly
  imports from `antd` or `@ant-design/icons`, `N` otherwise. A `Y` here
  is a strong signal that the component will need a shim (or a wholesale
  reimplementation) on mobile.
- **types.ts** — `Y` if the directory contains a sibling `types.ts`
  module.
- **stories** — `Y` if the directory contains at least one
  `*.stories.tsx` file.
- **Mobile readiness** — one of:
  - `port-as-is` — pure props, no DOM-only assumptions; the component's
    JSX/logic can be reused on React Native with only theming/styling
    adjustments.
  - `needs-shim` — relies on portals, DOM refs, focus traps, CSS
    hover/focus styles, or AntD-only props that have no direct RN
    analog. A small adapter layer (or a parallel native implementation)
    is required.
  - `web-only` — depends on browser APIs, the DOM, or heavy web-only
    dependencies (Ace, ag-grid, react-syntax-highlighter, dynamic ESM
    imports, tracking pixels, Storybook, …). Should not be ported to
    mobile; mobile screens should reach for a different primitive.

## Categories

The categories below match the mobile-oriented grouping that follow-up
PRs will materialize as `components/groups/<category>/`:

`actions`, `forms`, `selection`, `feedback`, `overlays`, `navigation`,
`layout`, `data-display`, `editors`, `misc`.

---

### actions

Buttons and other action triggers. These components surface
intent-to-act UI; they typically combine a label, an icon, and an
`onClick` handler.

| Component | Public exports | AntD | types.ts | stories | Description | Mobile readiness |
| --- | --- | :-: | :-: | :-: | --- | --- |
| `ActionButton` | `ActionButton`, `ActionProps` | N | N | N | Tooltip-wrapped action trigger used in toolbars and row actions. | needs-shim |
| `Button` | `Button`, `ButtonProps`, `OnClickHandler`, `getSecondaryButtonStyle`, `getSecondaryButtonHoverStyles` | Y | Y | Y | Themed wrapper around AntD `Button` with Superset button-style/size variants and optional tooltip. | needs-shim |
| `ButtonGroup` | `ButtonGroup`, `ButtonGroupProps` | N | Y | Y | Flex container that visually fuses adjacent `Button`s into a single group. | needs-shim |
| `DropdownButton` | `DropdownButton`, `DropdownButtonProps` | Y | Y | Y | AntD `Dropdown.Button` wrapper with overflow tooltip. | needs-shim |
| `IconButton` | `IconButton`, `IconButtonProps` | N | N | Y | Card-shaped, large clickable tile combining an icon, label, and tooltip. | needs-shim |
| `ModalTrigger` | `ModalTrigger`, `ModalTriggerProps`, `ModalTriggerRef` | N | N | Y | `Button` that opens an internally-managed `Modal`. | needs-shim |

---

### forms

Text/boolean/number inputs and form scaffolding (labels, validation
wrappers, `Form` context).

| Component | Public exports | AntD | types.ts | stories | Description | Mobile readiness |
| --- | --- | :-: | :-: | :-: | --- | --- |
| `Checkbox` | `Checkbox`, `CheckboxProps`, `CheckboxChangeEvent` | Y | Y | Y | Re-export of AntD `Checkbox` plus shared types. | needs-shim |
| `Form` | `Form`, `FormItem`, `FormLabel`, `LabeledErrorBoundInput`, `FormInstance`, `FormProps`, `FormItemProps` | Y | Y | Y | AntD `Form` family plus a labeled-input wrapper with inline error display. | needs-shim |
| `Input` | `Input`, `InputNumber`, plus AntD input/textarea/`InputRef` types | Y | Y | Y | Re-export of AntD `Input` and `InputNumber`. | needs-shim |
| `Radio` | `Radio` (with `Group`/`Button` static props), `RadioGroupWrapperProps`, AntD radio prop types | Y | N | Y | AntD `Radio` group composed with the local `Space` for layout. | needs-shim |
| `Slider` | `Slider` (default), `SliderSingleProps`, `SliderRangeProps` | Y | N | Y | Thin wrapper around AntD `Slider` supporting single and range modes. | needs-shim |
| `Switch` | `Switch`, `SwitchProps` | Y | N | Y | Re-export of AntD `Switch`. | needs-shim |
| `Upload` | `Upload`, `UploadFile`, `UploadChangeParam` | Y | N | Y | Re-export of AntD `Upload` with file-list typings. | web-only |

---

### selection

Pickers, selects, autocomplete, and date/time/timezone/cron/color
choosers — components whose purpose is to pick from a (potentially
async) set of options.

| Component | Public exports | AntD | types.ts | stories | Description | Mobile readiness |
| --- | --- | :-: | :-: | :-: | --- | --- |
| `AutoComplete` | `AutoComplete`, `AutoCompleteProps` | Y | Y | Y | Re-export of AntD `AutoComplete` plus shared types. | needs-shim |
| `ColorPicker` | `ColorPicker` (default + named), `ColorPickerProps`, `RGBColor`, `ColorValue` | Y | N | N | AntD `ColorPicker` re-export with Superset color value helpers. | needs-shim |
| `CronPicker` | `CronPicker`, `LOCALE`, `CronError` | N | Y | Y | `react-js-cron`-based scheduler input with localized labels. | web-only |
| `DatePicker` | `DatePicker`, `RangePicker`, `DatePickerProps`, `RangePickerProps` | Y | Y | Y | Themed wrapper around AntD `DatePicker` and `RangePicker`. | needs-shim |
| `Select` | `Select`, `AsyncSelect`, `RawAntdSelect`, `RawAntdSelectProps`, types/styles/constants barrels | Y | Y | Y | Superset's primary `Select` primitives (sync + async) built on AntD `Select` with custom paging, tagging, and styling. | needs-shim |
| `TimezoneSelector` | `TimezoneSelector` (default), `TimezoneSelectorProps` | N | Y | Y | Timezone picker built on top of `Select`, backed by an `extendedDayjs` cache. | needs-shim |
| `TreeSelect` | `TreeSelect`, `TreeSelectProps` | Y | N | Y | Re-export of AntD `TreeSelect`. | needs-shim |

---

### feedback

Loading states, progress, skeletons, results, empty states, and refresh
affordances — UI whose purpose is to communicate system status to the
user.

| Component | Public exports | AntD | types.ts | stories | Description | Mobile readiness |
| --- | --- | :-: | :-: | :-: | --- | --- |
| `EmptyState` | `EmptyState`, `Empty`, `imageMap`, `EmptyStateProps`, `EmptyStateSize`, `EmptyProps` | Y | Y | Y | Themed empty-state illustration + title/description/CTA, plus a thin AntD `Empty` wrapper. | port-as-is |
| `Loading` | `Loading`, `LoadingProps` | N | Y | Y | Centered inline/inline-centered SVG spinner with size variants. | port-as-is |
| `Progress` | `Progress`, `ProgressProps` | Y | N | N | Re-export of AntD `Progress`. | needs-shim |
| `ProgressBar` | `ProgressBar` (default), `ProgressBarProps` | Y | N | Y | Styled AntD `Progress` with Superset color tokens. | needs-shim |
| `RefreshLabel` | `RefreshLabel` (default), `RefreshLabelProps` | N | N | Y | Clickable refresh icon with tooltip; used to re-fetch data. | needs-shim |
| `Result` | `Result`, `ResultProps` | Y | N | N | Re-export of AntD `Result`. | needs-shim |
| `Skeleton` | `Skeleton`, `SkeletonProps` | Y | N | Y | Re-export of AntD `Skeleton`. | needs-shim |
| `Spin` | `Spin` | Y | N | N | Re-export of AntD `Spin`. | needs-shim |

---

### overlays

Modals, drawers, popovers, tooltips, popconfirms, and confirm/delete
modal triggers — components that float above page content via portals.

| Component | Public exports | AntD | types.ts | stories | Description | Mobile readiness |
| --- | --- | :-: | :-: | :-: | --- | --- |
| `ConfirmModal` | `ConfirmModal`, `ConfirmModalProps` | N | N | N | Generic yes/no confirmation modal composed from `Modal` + `Button`. | needs-shim |
| `ConfirmStatusChange` | `ConfirmStatusChange`, `ConfirmStatusChangeProps` | N | Y | Y | Render-prop wrapper that surfaces a `DeleteModal` for destructive actions. | needs-shim |
| `DeleteModal` | `DeleteModal`, `DeleteModalProps` | N | Y | N | Type-to-confirm delete modal built from `Modal`, `FormLabel`, and `Input`. | needs-shim |
| `Drawer` | `Drawer`, `DrawerProps` | Y | Y | N | Re-export of AntD `Drawer`. | needs-shim |
| `IconTooltip` | `IconTooltip`, `IconTooltipProps` | N | Y | Y | Tooltip-wrapped link-style `Button` for inline help icons. | needs-shim |
| `InfoTooltip` | `InfoTooltip`, `InfoTooltipProps` | Y | N | Y | Themed info tooltip with icon trigger and accessible keyboard activation. | needs-shim |
| `Modal` | `Modal`, `StyledModal`, `FormModal`, `ModalProps`, `FormModalProps` | Y | Y | Y | Superset's primary modal (`Modal` + responsive `FormModal` form scaffold). | needs-shim |
| `Popconfirm` | `Popconfirm`, `PopconfirmProps` | Y | N | N | Re-export of AntD `Popconfirm`. | needs-shim |
| `Popover` | `Popover`, `PopoverProps` | Y | N | Y | Thin wrapper around AntD `Popover`. | needs-shim |
| `PopoverSection` | `PopoverSection` (default), `PopoverSectionProps` | N | N | Y | Selectable section row designed to live inside a `Popover` body. | needs-shim |
| `Tooltip` | `Tooltip`, `TooltipProps`, `TooltipPlacement` | Y | Y | Y | Themed wrapper around AntD `Tooltip` that defaults `overlayStyle` for Superset. | needs-shim |
| `TooltipParagraph` | `TooltipParagraph` (default) | N | N | Y | Paragraph that automatically shows a tooltip when its text is truncated. | needs-shim |
| `UnsavedChangesModal` | `UnsavedChangesModal`, `UnsavedChangesModalProps` | N | N | Y | "You have unsaved changes" confirmation modal. | needs-shim |
| `WarningIconWithTooltip` | `WarningIconWithTooltip` (default), `WarningIconWithTooltipProps` | N | N | Y | Warning icon that reveals a markdown tooltip on hover. | needs-shim |

---

### navigation

Menus, breadcrumbs, steps, tabs, pagination, and dropdowns — components
that move the user between views or surface lists of secondary actions.

| Component | Public exports | AntD | types.ts | stories | Description | Mobile readiness |
| --- | --- | :-: | :-: | :-: | --- | --- |
| `Breadcrumb` | `Breadcrumb`, `BreadcrumbProps` | Y | Y | Y | Re-export of AntD `Breadcrumb`. | port-as-is |
| `Dropdown` | `Dropdown`, `MenuDotsDropdown`, `NoAnimationDropdown`, `DropdownProps`, `NoAnimationDropdownProps`, `MenuDotsDropdownProps` | Y | Y | Y | AntD `Dropdown` family with three Superset variants (default, no-animation, three-dots trigger). | needs-shim |
| `DropdownContainer` | `DropdownContainer`, `DropdownItem`, `DropdownRef`, `DropdownContainerProps` | N | Y | Y | Horizontal item list that automatically overflows extra items into a dropdown menu when the container is narrow. | web-only |
| `Menu` | `Menu`, `MainNav`, `MenuProps`, `MenuItem`, `MenuMode`, `MenuItemKeyEnum`, related AntD menu types | Y | N | Y | Themed AntD `Menu` plus a horizontal `MainNav` variant used as the app shell nav. | needs-shim |
| `PageHeaderWithActions` | `PageHeaderWithActions`, `PageHeaderWithActionsProps`, `menuTriggerStyles` | N | N | N | Page header composing title (editable), fave star, certified badge, and overflow action menu. | needs-shim |
| `Pagination` | `Pagination`, `PaginationProps` | Y | N | N | Re-export of AntD `Pagination`. | needs-shim |
| `PopoverDropdown` | `PopoverDropdown` (default), `PopoverDropdownProps`, `OptionProps`, `OnChangeHandler`, `RenderElementHandler` | N | N | Y | Title + popover dropdown of selectable options; used as a lightweight inline picker. | needs-shim |
| `Steps` | `Steps`, `StepsProps` | Y | N | Y | Re-export of AntD `Steps`. | port-as-is |
| `Tabs` | `Tabs` (default), `EditableTabs`, `LineEditableTabs`, `TabsProps` | Y | N | Y | Themed AntD `Tabs` with editable and line-style variants. | needs-shim |

---

### layout

Flex, space, grid, layout, divider, card, and collapse — components
whose primary job is structural (containing or arranging other content).

| Component | Public exports | AntD | types.ts | stories | Description | Mobile readiness |
| --- | --- | :-: | :-: | :-: | --- | --- |
| `Card` | `Card` (with `Meta`/`Grid` static props) | Y | Y | Y | Themed AntD `Card` exposed with the AntD static sub-components. | needs-shim |
| `Collapse` | `Collapse`, `CollapseLabelInModal`, `CollapseProps`, `CollapseLabelInModalProps` | Y | Y | Y | Themed AntD `Collapse` plus a label variant tuned for modal headers. | needs-shim |
| `Divider` | `Divider`, `DividerProps` | Y | Y | Y | Themed wrapper around AntD `Divider`. | port-as-is |
| `Flex` | `Flex`, `FlexProps` | Y | Y | Y | Thin wrapper around AntD `Flex`. | port-as-is |
| `Grid` | `Row`, `Col`, `Grid`, `RowProps`, `ColProps` | Y | Y | Y | Re-export of AntD `Row`/`Col`/`Grid` (24-column grid). | needs-shim |
| `Layout` | `Layout` (with `Header`/`Footer`/`Sider`/`Content` static props), `LayoutProps`, `SiderProps` | Y | Y | Y | Re-export of AntD `Layout` family — the page shell primitive. | needs-shim |
| `Space` | `Space`, `SpaceProps` | Y | N | Y | Re-export of AntD `Space`. | port-as-is |

---

### data-display

Read-only presentation: tables, lists, trees, tags, badges, avatars,
labels, typography, metadata strips, certified/fave badges, and similar
"facts on screen" primitives.

| Component | Public exports | AntD | types.ts | stories | Description | Mobile readiness |
| --- | --- | :-: | :-: | :-: | --- | --- |
| `Avatar` | `Avatar`, `AvatarGroup`, `AvatarProps`, `AvatarGroupProps` | Y | Y | Y | AntD `Avatar` and `Avatar.Group` thin wrappers. | needs-shim |
| `Badge` | `Badge`, `BadgeProps` | Y | Y | Y | Themed AntD `Badge` with Superset color tokens. | needs-shim |
| `CachedLabel` | `CachedLabel`, `CacheLabelProps` | N | Y | Y | "Cached" pill `Label` with refresh tooltip and elapsed-time content. | needs-shim |
| `CertifiedBadge` | `CertifiedBadge` | N | Y | Y | Tooltip-wrapped certification icon used on charts/dashboards. | needs-shim |
| `FaveStar` | `FaveStar`, `FaveStarProps` | N | Y | Y | Toggleable favorite star with tooltip and analytics. | needs-shim |
| `Image` | `Image`, `ImageProps` | Y | N | N | Re-export of AntD `Image`. | needs-shim |
| `Label` | `Label`, `DatasetTypeLabel`, `PublishedLabel`, `LabelType` | N | Y | Y | Pill label built on `Tag` plus reusable `DatasetTypeLabel` / `PublishedLabel` variants. | port-as-is |
| `LastUpdated` | `LastUpdated`, `LastUpdatedProps` | N | Y | N | Auto-refreshing "last updated X ago" caption. | port-as-is |
| `List` | `List`, `CompactListItemProps`, `ListProps`, `ListItemProps`, `ListItemMetaProps` | Y | Y | Y | Themed AntD `List` plus a compact `Item` variant. | needs-shim |
| `ListViewCard` | `ListViewCard`, `ImageLoader`, `ListViewCardProps` | N | Y | Y | Card used in list views (charts/dashboards/datasets) with thumbnail, title, actions, and certified/fave badges. | needs-shim |
| `Metadata` | `Metadata` (default), `MetadataProps` | N | N | N | Minimal label/value styled span used as a building block by `MetadataBar`. | port-as-is |
| `MetadataBar` | `MetadataBar` (default), `MetadataBarProps`, `MIN_NUMBER_ITEMS`, `MAX_NUMBER_ITEMS`, content-type exports | N | N | Y | Horizontal bar of metadata chips (owner, dashboards, etc.) with overflow handling. | needs-shim |
| `SafeMarkdown` | `SafeMarkdown`, `getOverrideHtmlSchema` | N | N | Y | Sanitized markdown renderer (`rehype-sanitize` + GFM) with feature-flag-gated HTML support. | needs-shim |
| `Table` | `Table` (default + named), `TableProps`, `TableSize`, `SelectionType`, `SortOrder`, `ETableAction`, `OnChangeFunction`, `ColumnsType`, `TablePaginationConfig`, `SorterResult`, `SUPERSET_TABLE_COLUMN` | Y | N | Y | Themed AntD `Table` with virtualization, drag-and-drop columns, and Superset selection/sorting helpers. | needs-shim |
| `TableCollection` | `TableCollection` (default) | Y | N | Y | `react-table` v7 collection rendered through Superset's `Table`. | needs-shim |
| `TableView` | re-exports from `./TableView` (`TableView`, `EmptyWrapperType`, `TableViewProps`) | N | Y | Y | Sortable/paginated table built on `react-table` and Superset `Table`. | needs-shim |
| `Tag` | `Tag` | Y | N | N | Re-export of AntD `Tag`. | needs-shim |
| `ThemedAgGridReact` | `ThemedAgGridReact`, `ThemedAgGridReactProps`, `AgGridReact`, `setupAGGridModules`, `defaultModules`, `AgGridContainerElement`, AG Grid type re-exports | N | N | N | AG Grid React wrapper themed with Superset tokens; used for the SQL Lab/data-grid surface. | web-only |
| `Timer` | `Timer`, `TimerProps` | N | N | Y | Live-ticking elapsed-time `Label` (counts up while running). | port-as-is |
| `Tree` | `Tree` (default), `TreeProps`, `TreeDataNode` | Y | N | Y | Re-export of AntD `Tree`. | needs-shim |
| `TruncatedList` | `TruncatedList` (default), `TruncatedListProps` | N | N | N | List that hides items past the truncation point and shows the rest in a tooltip; relies on DOM measurement via `useTruncation`. | web-only |
| `Typography` | `Typography` (with `Title`/`Text`/`Paragraph`/`Link` static props), `TypographyProps`, `TitleProps`, `ParagraphProps` | Y | N | Y | Themed AntD `Typography` namespace. | needs-shim |

---

### editors

Code/markdown editors, the async ace loader, and the dynamic editable
title primitive — components whose UX revolves around editing text.

| Component | Public exports | AntD | types.ts | stories | Description | Mobile readiness |
| --- | --- | :-: | :-: | :-: | --- | --- |
| `AsyncAceEditor` | `AsyncAceEditor`, `SQLEditor`, `FullSQLEditor`, `MarkdownEditor`, `TextAreaEditor`, `CssEditor`, `JsonEditor`, `ConfigEditor`, `JSEditor`, `aceModuleLoaders`, `getTooltipHTML`, `useJsonValidation`, plus ace/editor types | N | Y | Y | Async loader factory for `react-ace` editors with one preconfigured editor per language. | web-only |
| `CodeEditor` | `CodeEditor` (default + named), `CodeEditorProps`, `CodeEditorMode`, `CodeEditorTheme` | N | N | N | Synchronous `react-ace` editor with Superset theming, used for inline SQL/JSON/HTML/CSS editing. | web-only |
| `CodeSyntaxHighlighter` | `CodeSyntaxHighlighter` (default + named), `CodeSyntaxHighlighterProps`, `SupportedLanguage`, `preloadLanguages` | N | N | Y | Async `react-syntax-highlighter` wrapper with copy-to-clipboard affordance. | web-only |
| `DynamicEditableTitle` | `DynamicEditableTitle`, `DynamicEditableTitleProps` | N | Y | N | Editable title that auto-fits its width using `react-resize-detector`; used in chart and dashboard headers. | needs-shim |
| `EditableTitle` | `EditableTitle`, `EditableTitleProps` | N | Y | Y | Click-to-edit title input with optional `CertifiedBadge` and tooltip. | needs-shim |

---

### misc

Foundational or non-presentational modules that do not fit any of the
above categories. Includes the AntD theme bridge, the icon registry, the
async-ESM loader utility, the static asset barrel, the analytics pixel,
and the Storybook design-system intro.

| Component | Public exports | AntD | types.ts | stories | Description | Mobile readiness |
| --- | --- | :-: | :-: | :-: | --- | --- |
| `AntdThemeProvider` | `AntdThemeProvider` | Y | N | N | Wraps AntD's `ConfigProvider` to bridge the Superset theme into AntD components. | needs-shim |
| `AsyncEsmComponent` | `AsyncEsmComponent`, `PlaceholderProps` | N | Y | Y | Higher-order helper that lazily loads ESM React components with a placeholder fallback. | web-only |
| `Icons` | `Icons`, `IconNameType`, `IconType` | Y | Y | Y | Central registry of AntD-enhanced and async SVG icons used across the app. | needs-shim |
| `TelemetryPixel` | `TelemetryPixel` | N | N | N | Hidden 1×1 `<img>` used to record anonymous Superset version pings. | web-only |
| `assets` | re-exports `./svgs` and `./images` | N | N | N | Static SVG/PNG asset barrel consumed by `Loading`, `EmptyState`, and others. | port-as-is |
| `DesignSystem.stories.tsx` | default Storybook config, `DesignSystem` | N | N | Y | Storybook intro page that documents the Superset design system. | web-only |

---

## How to use this inventory

This file is the source of truth that subsequent group-barrel PRs will
consume. Each follow-up step in the modularization workstream will add a
single per-group barrel under
`components/groups/<category>/index.ts` that re-exports every component
listed in that category here, alongside a
`components/groups/<category>/README.md` that pins the same description
and `mobile_readiness` value next to the public exports for that group.

When the time comes to wire up a `groups/` directory:

1. Find the category table in this file (e.g. `actions`).
2. The `Component` column tells you which existing
   `components/<Component>` modules the new
   `components/groups/<category>/index.ts` should re-export from.
3. The `Public exports` column tells you which named/default exports
   need to be forwarded by that barrel — it is the contract the group
   barrel must keep stable.
4. The `Mobile readiness` column tells follow-up work where to focus:
   `port-as-is` rows are candidates for a shared `@superset-ui/mobile`
   surface, `needs-shim` rows are the work backlog, and `web-only` rows
   should be excluded from the mobile bundle and replaced by a
   mobile-native primitive.

Until those follow-up PRs land, this document is intentionally the only
artifact: no `groups/` directory exists yet, no component source has
been moved, and no Storybook stories have been changed.
