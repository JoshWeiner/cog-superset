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

# Overlays component group

This barrel groups the overlay-style primitives that ship from
`@superset-ui/core/components`: dialogs, drawers, popovers, and tooltips.
It exists alongside the existing flat barrel to give consumers a more
focused import surface when they only need overlay UI:

```ts
import {
  Modal,
  ConfirmModal,
  Drawer,
  Tooltip,
} from '@superset-ui/core/components/groups/overlays';
```

## Scope

The group re-exports the following components and their public types,
preserving the names and module paths used by the flat barrel at
`superset-frontend/packages/superset-ui-core/src/components/index.ts`:

| Export                                                   | Source folder                |
| -------------------------------------------------------- | ---------------------------- |
| `Modal`, `FormModal`, `StyledModal`, `ModalProps`, `FormModalProps` | `../../Modal`         |
| `ConfirmModal`, `ConfirmModalProps`                      | `../../ConfirmModal`         |
| `DeleteModal`, `DeleteModalProps`                        | `../../DeleteModal`          |
| `UnsavedChangesModal` and named exports (`export *`)     | `../../UnsavedChangesModal`  |
| `ModalTrigger` and named exports (`export *`)            | `../../ModalTrigger`         |
| `Drawer`, `DrawerProps`                                  | `../../Drawer`               |
| `Popover` and named exports (`export *`)                 | `../../Popover`              |
| `Popconfirm`, `PopconfirmProps`                          | `../../Popconfirm`           |
| `Tooltip` and named exports (`export *`)                 | `../../Tooltip`              |
| `RawAntdTooltip` (alias of `antd`'s `Tooltip`)           | `antd`                       |
| `IconTooltip`, `IconTooltipProps`                        | `../../IconTooltip`          |
| `InfoTooltip`, `InfoTooltipProps`                        | `../../InfoTooltip`          |
| `TooltipParagraph` (default export)                      | `../../TooltipParagraph`     |

## Conventions

- Re-exports are named so TypeScript types flow through unchanged.
- Module paths match the flat barrel verbatim; do not introduce new
  source paths from this barrel.
- The flat barrel at
  `superset-frontend/packages/superset-ui-core/src/components/index.ts`
  remains the canonical export point. This group barrel is additive.
- New overlay components added to the flat barrel should also be added
  here, with the same name and source path.
