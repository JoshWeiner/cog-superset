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
 * Category-level barrel for the Feedback component group.
 *
 * Re-exports user-facing feedback primitives from
 * `@superset-ui/core/components` so consumers can import them via a
 * single, scoped path:
 *
 *   import { Loading, EmptyState } from
 *     '@superset-ui/core/components/groups/feedback';
 *
 * The flat barrel at `components/index.ts` remains the canonical entry
 * point and is intentionally left untouched by this group barrel.
 */

export { Loading, type LoadingProps } from '../../Loading';
export { Skeleton, type SkeletonProps } from '../../Skeleton';
export { Spin } from '../../Spin';
export { Progress, type ProgressProps } from '../../Progress';
export {
  default as ProgressBar,
  type ProgressBarProps,
} from '../../ProgressBar';
export * from '../../Result';
export { EmptyState, type EmptyStateProps } from '../../EmptyState';
export { Empty, type EmptyProps } from '../../EmptyState/Empty';
export { default as RefreshLabel } from '../../RefreshLabel';
export { LastUpdated, type LastUpdatedProps } from '../../LastUpdated';
export { default as WarningIconWithTooltip } from '../../WarningIconWithTooltip';
export { CachedLabel, type CacheLabelProps } from '../../CachedLabel';
