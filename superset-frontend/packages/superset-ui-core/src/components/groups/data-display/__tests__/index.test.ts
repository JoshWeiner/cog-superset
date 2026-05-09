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

import * as DataDisplayGroup from '../index';

test('data-display barrel exposes the expected named exports', () => {
  const expected = [
    'Table',
    'TableView',
    'TableCollection',
    'List',
    'ListViewCard',
    'ImageLoader',
    'Tree',
    'Metadata',
    'MetadataBar',
    'Collapse',
    'CollapseLabelInModal',
    'Image',
    'TruncatedList',
    'Timer',
    'SafeMarkdown',
    'TelemetryPixel',
  ];

  const exportNames = Object.keys(DataDisplayGroup);
  for (const name of expected) {
    expect(exportNames).toContain(name);
    expect(
      DataDisplayGroup[name as keyof typeof DataDisplayGroup],
    ).toBeDefined();
  }
});

test('data-display barrel does not leak a default export', () => {
  expect(
    (DataDisplayGroup as { default?: unknown }).default,
  ).toBeUndefined();
});
