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

import * as overlays from '../index';

test('overlays group barrel re-exports the expected named values', () => {
  const expected = [
    'Modal',
    'FormModal',
    'StyledModal',
    'ConfirmModal',
    'DeleteModal',
    'ModalTrigger',
    'UnsavedChangesModal',
    'Drawer',
    'Popover',
    'Popconfirm',
    'Tooltip',
    'RawAntdTooltip',
    'IconTooltip',
    'InfoTooltip',
    'TooltipParagraph',
  ];
  for (const name of expected) {
    expect(overlays).toHaveProperty(name);
    expect(
      (overlays as Record<string, unknown>)[name],
    ).toBeDefined();
  }
});
