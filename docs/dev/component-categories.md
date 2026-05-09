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

# Shared Component Categories (`@superset-ui/core/components`)

This document is a **documentation-only** inventory and categorization of the
shared React components that live under
`superset-frontend/packages/superset-ui-core/src/components/`. It exists to
support a multi-step modularization workstream whose downstream steps build
**category barrels** (e.g. `@superset-ui/core/components/primitives`) that are
suitable for selective reuse on platforms with constraints — for example a
mobile build that needs to exclude desktop-only editors and grids.

The categories below mirror the taxonomy defined by the workstream. No
component has been moved or renamed and `index.ts` has not been touched as part
of this step.

## How to read the tables

Each row describes one component:

- **Component** — the name from the workstream taxonomy (typically the
  folder name under `components/`).
- **Source path** — the location on disk, relative to the repository root.
- **Re-export in `components/index.ts`** — the literal `export …` line(s) that
  surface the component (or its sibling members) from the package barrel at
  `superset-frontend/packages/superset-ui-core/src/components/index.ts`. A
  value of *Not exported via barrel* means the folder exists but downstream
  category barrels would have to add the export themselves; consumers in the
  app today import these directly from their subpath rather than from
  `@superset-ui/core/components`.
- **Caveats** — short, factual notes that downstream sessions need before
  bundling, especially anything that ties the component to a heavy dependency
  or to browser-only globals (`document`, `window`, `navigator`).

All "Source path" entries are abbreviated relative to
`superset-frontend/packages/superset-ui-core/src/components/`. The full prefix
is omitted for readability.

## Primitives

Layout, typography, and small visual primitives. Generally safe for any target
(no heavy runtime deps, no browser-only globals beyond standard React DOM).

| Component       | Source path             | Re-export in `components/index.ts`                                                                  | Caveats |
| --------------- | ----------------------- | --------------------------------------------------------------------------------------------------- | ------- |
| Button          | `Button/`               | `export { Button, type ButtonProps, type OnClickHandler } from './Button';`                         | — |
| Badge           | `Badge/`                | `export { Badge, type BadgeProps } from './Badge';`                                                 | — |
| Tag             | `Tag/`                  | `export * from './Tag';`                                                                            | — |
| Label           | `Label/`                | `export { Label, DatasetTypeLabel, PublishedLabel, type LabelType } from './Label';`                | Barrel also exports the higher-level `DatasetTypeLabel` / `PublishedLabel` variants. |
| Divider         | `Divider/`              | `export { Divider, type DividerProps } from './Divider';`                                           | — |
| Typography      | `Typography/`           | `export { Typography, type TypographyProps, type ParagraphProps, type TitleProps } from './Typography';` | — |
| Space           | `Space/`                | `export * from './Space';`                                                                          | — |
| Flex            | `Flex/`                 | `export { Flex, type FlexProps } from './Flex';`                                                    | — |
| Grid            | `Grid/`                 | `export { Grid, Row, Col, type RowProps, type ColProps } from './Grid';`                            | Also exports antd `Row`/`Col`. |
| Avatar          | `Avatar/`               | `export { Avatar, AvatarGroup, type AvatarProps, type AvatarGroupProps } from './Avatar';`          | Also exports `AvatarGroup`. |
| Card            | `Card/`                 | `export { Card } from './Card';`                                                                    | — |
| Icons           | `Icons/`                | `export * from './Icons';`                                                                          | Re-exports a large generated icon set; consider tree-shaking impact. |
| IconButton      | `IconButton/`           | `export { IconButton, type IconButtonProps } from './IconButton';`                                  | — |
| ActionButton    | `ActionButton/`         | `export { ActionButton, type ActionProps } from './ActionButton';`                                  | — |
| CertifiedBadge  | `CertifiedBadge/`       | `export { CertifiedBadge } from './CertifiedBadge';`                                                | — |
| FaveStar        | `FaveStar/`             | `export { FaveStar, type FaveStarProps } from './FaveStar';`                                        | — |

## FormInputs

Form controls and input widgets. Most wrap antd; pickers transitively pull
`dayjs` / `rc-picker` data. `CronPicker` has its own non-trivial sub-tree.

| Component             | Source path                | Re-export in `components/index.ts`                                                                     | Caveats |
| --------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------ | ------- |
| Input                 | `Input/`                   | `export * from './Input';`                                                                             | — |
| Checkbox              | `Checkbox/`                | `export { Checkbox, type CheckboxProps, type CheckboxChangeEvent } from './Checkbox';`                 | — |
| Radio                 | `Radio/`                   | `export * from './Radio';`                                                                             | — |
| Switch                | `Switch/`                  | `export { Switch, type SwitchProps } from './Switch';`                                                 | — |
| Select                | `Select/`                  | `export * from './Select';`                                                                            | Folder ships several variants (`Select`, `AsyncSelect`, etc.) re-exported via `*`. |
| AutoComplete          | `AutoComplete/`            | `export { AutoComplete, type AutoCompleteProps } from './AutoComplete';`                               | — |
| DatePicker            | `DatePicker/`              | `export * from './DatePicker';`                                                                        | Also exports `RangePicker` (built from antd `DatePicker`). Pulls `dayjs` locale data. |
| TimePicker            | *(no folder)*              | *Not exported via barrel*                                                                              | **No standalone component exists.** Consumers use antd `TimePicker` directly or the `time` mode of `DatePicker`. Downstream barrels should either omit it or add a wrapper before exporting. |
| TimezoneSelector      | `TimezoneSelector/`        | *Not exported via barrel*                                                                              | Imported directly via `@superset-ui/core/components/TimezoneSelector` today. Pulls a sizeable `moment-timezone` cache (`TimezoneOptionsCache`). |
| Form                  | `Form/`                    | `export { Form, FormItem, FormLabel, LabeledErrorBoundInput, type FormInstance, type FormProps, type FormItemProps } from './Form';` | `LabeledErrorBoundInput` touches `document` for focus management. |
| Slider                | `Slider/`                  | `export { default as Slider, type SliderSingleProps, type SliderRangeProps } from './Slider';`         | Default export — preserve when re-bundling. |
| ColorPicker           | `ColorPicker/`             | `export { ColorPicker, type ColorPickerProps, type RGBColor, type ColorValue } from './ColorPicker';`  | Pulls `react-color` (color picker UI). |
| TreeSelect            | `TreeSelect/`              | `export { TreeSelect, type TreeSelectProps } from './TreeSelect';`                                     | — |
| Upload                | `Upload/`                  | `export { Upload, type UploadFile, type UploadChangeParam } from './Upload';`                          | Browser file APIs (`File`, `FormData`). |
| CronPicker            | `CronPicker/`              | `export { CronPicker, type CronError } from './CronPicker';`                                           | Has its own sub-component tree under `CronPicker/`. |
| EditableTitle         | `EditableTitle/`           | `export { EditableTitle, type EditableTitleProps } from './EditableTitle';`                            | Uses `document` / `window` for focus and selection. |
| DynamicEditableTitle  | `DynamicEditableTitle/`    | `export { DynamicEditableTitle, type DynamicEditableTitleProps } from './DynamicEditableTitle';`       | Same DOM-focus assumptions as `EditableTitle`. |

## Feedback

Loading, status, and lightweight inline feedback components.

| Component                | Source path                   | Re-export in `components/index.ts`                                                       | Caveats |
| ------------------------ | ----------------------------- | ---------------------------------------------------------------------------------------- | ------- |
| Loading                  | `Loading/`                    | `export { Loading, type LoadingProps } from './Loading';`                                | — |
| Skeleton                 | `Skeleton/`                   | `export { Skeleton, type SkeletonProps } from './Skeleton';`                             | — |
| Spin                     | `Spin/`                       | *Not exported via barrel*                                                                | `Spin/index.tsx` is a thin re-export of antd `Spin` (`export { Spin } from 'antd';`). |
| Progress                 | `Progress/`                   | `export { Progress, type ProgressProps } from './Progress';`                             | — |
| ProgressBar              | `ProgressBar/`                | `export { default as ProgressBar, type ProgressBarProps } from './ProgressBar';`         | Default export. |
| Result                   | `Result/`                     | `export * from './Result';`                                                              | — |
| EmptyState               | `EmptyState/`                 | `export { EmptyState, type EmptyStateProps } from './EmptyState';`                       | Uses `document` / `window` for layout helpers. |
| Empty                    | `EmptyState/Empty.tsx`        | `export { Empty, type EmptyProps } from './EmptyState/Empty';`                           | Lives **inside** `EmptyState/`; downstream barrels must keep this re-export path. |
| RefreshLabel             | `RefreshLabel/`               | *Not exported via barrel*                                                                | Imported directly today; depends on `Icons`. |
| LastUpdated              | `LastUpdated/`                | `export { LastUpdated, type LastUpdatedProps } from './LastUpdated';`                    | Renders relative time; pulls `moment`/`dayjs`. |
| WarningIconWithTooltip   | `WarningIconWithTooltip/`     | *Not exported via barrel*                                                                | Imported directly today; depends on `Tooltip` + `Icons`. |
| CachedLabel              | `CachedLabel/`                | `export { CachedLabel, type CacheLabelProps } from './CachedLabel';`                     | — |

## Overlays

Modals, drawers, popovers, tooltips. All depend on antd portals (`document.body`) and assume a real DOM.

| Component             | Source path                | Re-export in `components/index.ts`                                                                     | Caveats |
| --------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------ | ------- |
| Modal                 | `Modal/`                   | `export { Modal, FormModal, StyledModal, type ModalProps, type FormModalProps } from './Modal';`        | `Modal/Modal.tsx` reads `document.documentElement` for sizing. |
| ConfirmModal          | `ConfirmModal/`            | `export { ConfirmModal, type ConfirmModalProps } from './ConfirmModal';`                                | — |
| DeleteModal           | `DeleteModal/`             | `export { DeleteModal, type DeleteModalProps } from './DeleteModal';`                                   | — |
| UnsavedChangesModal   | `UnsavedChangesModal/`     | `export * from './UnsavedChangesModal';`                                                               | — |
| FormModal             | `Modal/FormModal.tsx`      | `export { Modal, FormModal, StyledModal, ... } from './Modal';`                                         | Lives **inside** `Modal/`; not its own folder. Re-exported alongside `Modal`. |
| ModalTrigger          | `ModalTrigger/`            | `export * from './ModalTrigger';`                                                                      | — |
| Drawer                | `Drawer/`                  | `export { Drawer, type DrawerProps } from './Drawer';`                                                  | antd portal — needs `document.body`. |
| Popover               | `Popover/`                 | `export * from './Popover';`                                                                            | antd portal. |
| Popconfirm            | `Popconfirm/`              | `export { Popconfirm, type PopconfirmProps } from './Popconfirm';`                                      | antd portal. |
| Tooltip               | `Tooltip/`                 | `export * from './Tooltip';` (the barrel additionally re-exports the raw antd Tooltip as `RawAntdTooltip`) | antd portal. |
| IconTooltip           | `IconTooltip/`             | `export { IconTooltip, type IconTooltipProps } from './IconTooltip';`                                   | — |
| InfoTooltip           | `InfoTooltip/`             | `export { InfoTooltip, type InfoTooltipProps } from './InfoTooltip';`                                   | — |
| TooltipParagraph      | `TooltipParagraph/`        | *Not exported via barrel*                                                                              | Imported directly today; combines `Tooltip` + truncation logic. |

## Navigation

Menus, dropdowns, tabs, and chrome that drives navigation between views.

| Component               | Source path                | Re-export in `components/index.ts`                                                                                                  | Caveats |
| ----------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Menu                    | `Menu/`                    | `export * from './Menu';`                                                                                                           | — |
| Dropdown                | `Dropdown/`                | `export { Dropdown, MenuDotsDropdown, NoAnimationDropdown, type DropdownProps, type NoAnimationDropdownProps, type MenuDotsDropdownProps } from './Dropdown';` | Single barrel groups `Dropdown` + `MenuDotsDropdown` + `NoAnimationDropdown`. |
| DropdownButton          | `DropdownButton/`          | `export { DropdownButton, type DropdownButtonProps } from './DropdownButton';`                                                      | — |
| DropdownContainer       | `DropdownContainer/`       | `export { DropdownContainer, type DropdownItem, type DropdownRef } from './DropdownContainer';`                                     | Uses `ResizeObserver` and `document` for overflow detection. |
| MenuDotsDropdown        | `Dropdown/`                | (re-exported via the `Dropdown` barrel — see above)                                                                                 | Same module as `Dropdown`. |
| NoAnimationDropdown     | `Dropdown/`                | (re-exported via the `Dropdown` barrel — see above)                                                                                 | Same module as `Dropdown`. |
| Tabs                    | `Tabs/`                    | `export { default as Tabs, EditableTabs, LineEditableTabs, type TabsProps } from './Tabs';`                                          | Default export plus `EditableTabs` / `LineEditableTabs` siblings. |
| Steps                   | `Steps/`                   | `export * from './Steps';`                                                                                                          | — |
| Breadcrumb              | `Breadcrumb/`              | `export { Breadcrumb, type BreadcrumbProps } from './Breadcrumb';`                                                                  | — |
| Pagination              | `Pagination/`              | `export { Pagination, type PaginationProps } from './Pagination';`                                                                  | — |
| Layout                  | `Layout/`                  | `export { Layout, type LayoutProps, type SiderProps } from './Layout';`                                                             | antd `Layout` (`Header`/`Sider`/`Content`/`Footer`). |
| PageHeaderWithActions   | `PageHeaderWithActions/`   | *Not exported via barrel*                                                                                                           | Imported directly today; composes `Dropdown`, `Tooltip`, `EditableTitle`, `CertifiedBadge`, `FaveStar`. Heavy dependency surface. |

## DataDisplay

Tables, lists, trees, and other data renderers.

| Component         | Source path             | Re-export in `components/index.ts`                                                            | Caveats |
| ----------------- | ----------------------- | --------------------------------------------------------------------------------------------- | ------- |
| Table             | `Table/`                | `export * from './Table';`                                                                    | Wraps antd `Table`; includes virtualization helpers. |
| TableView         | `TableView/`            | `export * from './TableView';`                                                                | Higher-level paged/sortable table; uses `react-table`. |
| TableCollection   | `TableCollection/`      | *Not exported via barrel*                                                                     | Imported directly today; lower-level helper used by `TableView`. |
| List              | `List/`                 | `export { List, type ListProps, type ListItemProps } from './List';`                          | — |
| ListViewCard      | `ListViewCard/`         | `export { ListViewCard, ImageLoader, type ListViewCardProps } from './ListViewCard';`         | Also exports `ImageLoader`. |
| Tree              | `Tree/`                 | `export { default as Tree, type TreeProps, type TreeDataNode } from './Tree';`                | Default export. |
| Metadata          | `Metadata/`             | *Not exported via barrel*                                                                     | Folder contains a single `index.tsx`; consumers import the subpath directly. |
| MetadataBar       | `MetadataBar/`          | `export { default as MetadataBar, type MetadataBarProps } from './MetadataBar';`              | Default export. |
| Collapse          | `Collapse/`             | `export { Collapse, type CollapseProps, CollapseLabelInModal, type CollapseLabelInModalProps } from './Collapse';` | Also exports `CollapseLabelInModal`. |
| Image             | `Image/`                | `export { Image, type ImageProps } from './Image';`                                           | — |
| TruncatedList     | `TruncatedList/`        | *Not exported via barrel*                                                                     | Folder contains a single `index.tsx`; consumers import the subpath directly. |
| Timer             | `Timer/`                | `export * from './Timer';`                                                                    | Uses `setInterval`; safe in any JS runtime. |
| SafeMarkdown      | `SafeMarkdown/`         | `export * from './SafeMarkdown/SafeMarkdown';`                                                 | Pulls a Markdown renderer + sanitizer; non-trivial bundle weight. |
| TelemetryPixel    | `TelemetryPixel/`       | `export * from './TelemetryPixel';`                                                           | Renders an `<img>` beacon — assumes network access. |

## DesktopOnly

Components that pull large desktop-oriented dependencies (code editors,
data-grid). They should be excluded from mobile / lightweight bundles.

| Component                | Source path                  | Re-export in `components/index.ts`                                                                                                                | Caveats |
| ------------------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| AsyncAceEditor           | `AsyncAceEditor/`            | `export { AsyncAceEditor, CssEditor, JsonEditor, JSEditor, SQLEditor, FullSQLEditor, MarkdownEditor, TextAreaEditor, ConfigEditor, type AsyncAceEditorProps, type Editor, type AceCompleterKeyword } from './AsyncAceEditor';` | Imports `react-ace` + `ace-builds` (lazy via `AsyncEsmComponent`). Browser-only; large bundle. Re-exports many concrete editors. |
| CodeEditor               | `CodeEditor/`                | `export { CodeEditor, type CodeEditorProps, type CodeEditorMode, type CodeEditorTheme } from './CodeEditor';`                                       | Imports `react-ace` and side-effect-imports many `ace-builds` modes/themes (eager). Browser-only. |
| CodeSyntaxHighlighter    | `CodeSyntaxHighlighter/`     | *Not exported via barrel*                                                                                                                         | Imports `react-syntax-highlighter` (light build) plus hljs theme assets. Heavy. |
| ThemedAgGridReact        | `ThemedAgGridReact/`         | `export { ThemedAgGridReact, type ThemedAgGridReactProps, type AgGridContainerElement, setupAGGridModules, defaultModules } from './ThemedAgGridReact';` | Imports `ag-grid-react` + `ag-grid-community`. Browser-only; very heavy. |

## Notes on items not exported via the barrel

The following components from the workstream taxonomy are present in
`packages/superset-ui-core/src/components/` (or in the case of `TimePicker`,
absent entirely) but are **not** re-exported from the package's
`components/index.ts` barrel:

- `TimezoneSelector`
- `Spin`
- `RefreshLabel`
- `WarningIconWithTooltip`
- `TooltipParagraph`
- `PageHeaderWithActions`
- `TableCollection`
- `Metadata`
- `TruncatedList`
- `CodeSyntaxHighlighter`
- `TimePicker` *(no implementation in the repo)*

Downstream sessions that build category barrels need to decide, per component,
whether to:

1. Add the missing re-export to a category barrel (preferred for components
   that already have a stable public surface), **or**
2. Keep callers importing the subpath directly until a follow-up step
   formalizes the public API.

Per the workstream contract, this step does **not** modify
`packages/superset-ui-core/src/components/index.ts` or move/rename any
component.
