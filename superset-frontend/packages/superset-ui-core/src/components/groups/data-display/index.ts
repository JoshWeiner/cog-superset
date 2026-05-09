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
 * Category-level barrel for the Data Display component group.
 *
 * Mirrors names and paths from
 * `superset-frontend/packages/superset-ui-core/src/components/index.ts`
 * for the components that present or organize data (tables, lists,
 * metadata, collapsible regions, images, timers, markdown, telemetry).
 *
 * The existing flat barrel is intentionally left untouched; this file
 * is additive and consumers can opt in via
 * `@superset-ui/core/components/groups/data-display`.
 */

export * from '../../Table';
export * from '../../TableView';
export { default as TableCollection } from '../../TableCollection';
export { List, type ListProps, type ListItemProps } from '../../List';
export {
  ListViewCard,
  ImageLoader,
  type ListViewCardProps,
} from '../../ListViewCard';
export { default as Tree, type TreeProps, type TreeDataNode } from '../../Tree';
export { default as Metadata, type MetadataProps } from '../../Metadata';
export {
  default as MetadataBar,
  type MetadataBarProps,
} from '../../MetadataBar';
export {
  Collapse,
  type CollapseProps,
  CollapseLabelInModal,
  type CollapseLabelInModalProps,
} from '../../Collapse';
export { Image, type ImageProps } from '../../Image';
export {
  default as TruncatedList,
  type TruncatedListProps,
} from '../../TruncatedList';
export * from '../../Timer';
export * from '../../SafeMarkdown/SafeMarkdown';
export * from '../../TelemetryPixel';
