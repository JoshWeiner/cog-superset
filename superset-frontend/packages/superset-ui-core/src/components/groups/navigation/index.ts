/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * Navigation component group: menus, dropdowns, tabs, steps, breadcrumbs,
 * pagination, layout shells and the page header. This barrel re-exports the
 * public API of the underlying components without modifying them, so it can
 * serve as a stable, narrowly-scoped entry point for the Navigation domain.
 *
 * Names and paths mirror the flat barrel at
 * `superset-frontend/packages/superset-ui-core/src/components/index.ts`.
 */
export * from '../../Menu';
export {
  Dropdown,
  MenuDotsDropdown,
  NoAnimationDropdown,
  type DropdownProps,
  type NoAnimationDropdownProps,
  type MenuDotsDropdownProps,
} from '../../Dropdown';
export { DropdownButton, type DropdownButtonProps } from '../../DropdownButton';
export {
  DropdownContainer,
  type DropdownItem,
  type DropdownRef,
} from '../../DropdownContainer';
export {
  default as Tabs,
  EditableTabs,
  LineEditableTabs,
  type TabsProps,
} from '../../Tabs';
export * from '../../Steps';
export { Breadcrumb, type BreadcrumbProps } from '../../Breadcrumb';
export { Pagination, type PaginationProps } from '../../Pagination';
export { Layout, type LayoutProps, type SiderProps } from '../../Layout';
export { PageHeaderWithActions } from '../../PageHeaderWithActions';
export type { PageHeaderWithActionsProps } from '../../PageHeaderWithActions';
