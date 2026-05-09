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
import mergeMargin from './mergeMargin';

test('mergeMargin expands margins by default', () => {
  expect(
    mergeMargin(
      { top: 1, left: 2, bottom: 3, right: 4 },
      { top: 5, left: 1, bottom: 2, right: 6 },
    ),
  ).toEqual({ top: 5, left: 2, bottom: 3, right: 6 });
});

test('mergeMargin shrinks margins in shrink mode', () => {
  expect(
    mergeMargin(
      { top: 1, left: 2, bottom: 3, right: 4 },
      { top: 5, left: 1, bottom: 2, right: 6 },
      'shrink',
    ),
  ).toEqual({ top: 1, left: 1, bottom: 2, right: 4 });
});

test('mergeMargin handles missing sides', () => {
  expect(mergeMargin({}, { top: 5 })).toEqual({
    top: 5,
    left: 0,
    bottom: 0,
    right: 0,
  });
});
