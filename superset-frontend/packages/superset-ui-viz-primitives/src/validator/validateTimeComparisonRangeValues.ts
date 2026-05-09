/*
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

import { tr as t } from './i18n';

/**
 * Local mirror of `@superset-ui/core`'s `ComparisonTimeRangeType` enum. Kept
 * here so the validator package stays portable and free of cross-module
 * imports; the canonical definition (used at runtime by the Superset app)
 * still lives in `superset-ui-core/src/time-comparison/types.ts` and the
 * underlying string values are identical, so any value produced by either
 * source compares equal.
 */
export enum ComparisonTimeRangeType {
  Custom = 'c',
  InheritedRange = 'r',
  Month = 'm',
  Week = 'w',
  Year = 'y',
}

const ensureIsArray = <T>(value?: T[] | T | null): T[] => {
  if (value === undefined || value === null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
};

export const validateTimeComparisonRangeValues = (
  timeRangeValue?: unknown,
  controlValue?: unknown,
): string[] => {
  const isCustomTimeRange = timeRangeValue === ComparisonTimeRangeType.Custom;
  const isCustomControlEmpty =
    Array.isArray(controlValue) &&
    controlValue.every((val: unknown) => ensureIsArray(val).length === 0);
  return isCustomTimeRange && isCustomControlEmpty
    ? [t('Filters for comparison must have a value')]
    : [];
};

export default validateTimeComparisonRangeValues;
