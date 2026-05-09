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
 * Category-level barrel for the "Primitives" component group.
 *
 * Re-exports lightweight, foundational UI primitives from the existing
 * @superset-ui/core component folders. This barrel is purely additive and
 * mirrors the named exports declared in
 * superset-frontend/packages/superset-ui-core/src/components/index.ts.
 *
 * This category must remain free of heavy dependencies such as react-ace,
 * ag-grid, react-markdown, and react-draggable. See the adjacent README.md
 * for details.
 */

export { Button, type ButtonProps, type OnClickHandler } from '../../Button';
export { ButtonGroup, type ButtonGroupProps } from '../../ButtonGroup';
export { Badge, type BadgeProps } from '../../Badge';
export * from '../../Tag';
export {
  Label,
  DatasetTypeLabel,
  PublishedLabel,
  type LabelType,
} from '../../Label';
export { Divider, type DividerProps } from '../../Divider';
export {
  Typography,
  type TypographyProps,
  type ParagraphProps,
  type TitleProps,
} from '../../Typography';
export * from '../../Space';
export { Flex, type FlexProps } from '../../Flex';
export { Grid, Row, Col, type RowProps, type ColProps } from '../../Grid';
export {
  Avatar,
  AvatarGroup,
  type AvatarProps,
  type AvatarGroupProps,
} from '../../Avatar';
export { Card } from '../../Card';
export * from '../../Icons';
export { IconButton, type IconButtonProps } from '../../IconButton';
export { ActionButton, type ActionProps } from '../../ActionButton';
export { CertifiedBadge } from '../../CertifiedBadge';
export { FaveStar, type FaveStarProps } from '../../FaveStar';
