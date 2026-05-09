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
 * Category-level barrel for the Overlays component group.
 *
 * Aggregates overlay-style components (modals, drawers, popovers, tooltips)
 * exported from `@superset-ui/core/components`. Paths mirror the flat barrel
 * verbatim so imports through this group stay in lockstep with the existing
 * top-level entry point.
 */

export {
  Modal,
  FormModal,
  StyledModal,
  type ModalProps,
  type FormModalProps,
} from '../../Modal';
export { ConfirmModal, type ConfirmModalProps } from '../../ConfirmModal';
export { DeleteModal, type DeleteModalProps } from '../../DeleteModal';
export * from '../../UnsavedChangesModal';
export * from '../../ModalTrigger';
export { Drawer, type DrawerProps } from '../../Drawer';
export * from '../../Popover';
export { Popconfirm, type PopconfirmProps } from '../../Popconfirm';
export * from '../../Tooltip';
export { Tooltip as RawAntdTooltip } from 'antd';
export { IconTooltip, type IconTooltipProps } from '../../IconTooltip';
export { InfoTooltip, type InfoTooltipProps } from '../../InfoTooltip';
export { default as TooltipParagraph } from '../../TooltipParagraph';
