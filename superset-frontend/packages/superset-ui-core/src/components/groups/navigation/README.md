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

# Navigation

Navigation: menus, dropdowns, tabs, steps, breadcrumbs, pagination, layout
shells and the page header.

This package is a thin barrel that re-exports the public API of existing
navigation-related components from `@superset-ui/core/components`. It exists
to provide a stable, narrowly-scoped entry point that can be consumed by
mobile-facing layers (or alternative renderers) without having to depend on
the full component index. No behavior is changed — every export here is a
direct re-export of an existing component or type.

Names and paths mirror the flat barrel at
`superset-frontend/packages/superset-ui-core/src/components/index.ts`.

## Members

| Member | Source |
| --- | --- |
| `Menu`, `MainNav`, `MenuItemKeyEnum` and related types (`MenuProps`, `ItemType`, `MenuItemType`, `AntdMenuTypeRef`, `AntdMenuItemType`, `MenuItemChildType`, `MenuMode`, `MenuItem`) — re-exported via `export *` | `../../Menu` |
| `Dropdown`, `MenuDotsDropdown`, `NoAnimationDropdown` (and `DropdownProps`, `NoAnimationDropdownProps`, `MenuDotsDropdownProps`) | `../../Dropdown` |
| `DropdownButton` (and `DropdownButtonProps`) | `../../DropdownButton` |
| `DropdownContainer` (and `DropdownItem`, `DropdownRef`) | `../../DropdownContainer` |
| `Tabs` (default), `EditableTabs`, `LineEditableTabs` (and `TabsProps`) | `../../Tabs` |
| `Steps` (and `StepsProps`) — re-exported via `export *` | `../../Steps` |
| `Breadcrumb` (and `BreadcrumbProps`) | `../../Breadcrumb` |
| `Pagination` (and `PaginationProps`) | `../../Pagination` |
| `Layout` (and `LayoutProps`, `SiderProps`) | `../../Layout` |
| `PageHeaderWithActions` (and `PageHeaderWithActionsProps`) | `../../PageHeaderWithActions` |

## Mobile considerations

The members of this group are currently web-only Ant Design wrappers. A
mobile renderer will need to provide shims or alternative implementations
for several capabilities that have no direct React Native equivalent:

- **`Menu` / `MainNav` / `Dropdown` / `DropdownButton`** — AntD menus and
  dropdowns rely on absolutely-positioned DOM popups, hover state, and
  keyboard focus management. On mobile, equivalent affordances are usually
  bottom sheets, action sheets, or native context menus, and the popup
  positioning logic must be replaced.
- **`DropdownContainer`** — measures available width with the DOM
  (`ResizeObserver` / `getBoundingClientRect`) to overflow items into a
  "more" menu. A mobile target needs an analogous layout primitive backed
  by native measurement APIs.
- **`Tabs`, `EditableTabs`, `LineEditableTabs`** — built on AntD `Tabs`,
  which uses DOM scroll containers and pointer events for the tab bar. A
  mobile shim needs to map these to a horizontal `ScrollView` or a native
  segmented control while preserving the same controlled `activeKey`
  contract.
- **`Steps`** — purely visual but renders DOM nodes with web-only
  layout/iconography. A mobile target should re-render the same step
  state with native primitives.
- **`Breadcrumb` / `Pagination`** — conceptually portable but render DOM
  links and use anchor navigation. A mobile renderer needs to swap
  anchors for navigation primitives (e.g. `react-navigation`).
- **`Layout`** — AntD `Layout` (`Header`, `Sider`, `Content`, `Footer`)
  is a flexbox-based shell driven by DOM. Mobile equivalents are usually
  drawer + tab navigators rather than a sider/content split, so this is
  the biggest shape mismatch in the group.
- **`PageHeaderWithActions`** — composes `DynamicEditableTitle`,
  `Dropdown`, `Button`, etc., several of which are themselves web-only.
  A mobile renderer will likely re-implement this header with native
  primitives rather than reuse the wrapper.

## Usage

```ts
import {
  Menu,
  Dropdown,
  Tabs,
  Breadcrumb,
  Pagination,
  Layout,
  PageHeaderWithActions,
} from '@superset-ui/core/components/groups/navigation';
```

The flat barrel at `@superset-ui/core/components` is unchanged and remains
the canonical entry point for application code.
