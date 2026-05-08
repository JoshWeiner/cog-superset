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

import {
  buildCsvFileName,
  encodeCsv,
  encodeCsvField,
} from './csvEncode';

// eslint-disable-next-line no-restricted-globals -- TODO: Migrate from describe blocks
describe('encodeCsvField', () => {
  test('returns empty string for null and undefined', () => {
    expect(encodeCsvField(null)).toEqual('');
    expect(encodeCsvField(undefined)).toEqual('');
  });

  test('passes through plain values without quoting', () => {
    expect(encodeCsvField('hello')).toEqual('hello');
    expect(encodeCsvField(42)).toEqual('42');
    expect(encodeCsvField(true)).toEqual('true');
  });

  test('wraps fields containing commas in double quotes', () => {
    expect(encodeCsvField('a,b,c')).toEqual('"a,b,c"');
  });

  test('escapes embedded double quotes by doubling them', () => {
    expect(encodeCsvField('she said "hi"')).toEqual('"she said ""hi"""');
  });

  test('wraps fields containing newlines in double quotes', () => {
    expect(encodeCsvField('line1\nline2')).toEqual('"line1\nline2"');
    expect(encodeCsvField('line1\r\nline2')).toEqual('"line1\r\nline2"');
  });
});

// eslint-disable-next-line no-restricted-globals -- TODO: Migrate from describe blocks
describe('encodeCsv', () => {
  test('encodes a header row and one data row joined with CRLF', () => {
    const csv = encodeCsv([{ a: 1, b: 2 }], ['a', 'b']);
    expect(csv).toEqual('a,b\r\n1,2');
  });

  test('escapes commas, quotes, and newlines inside cells', () => {
    const csv = encodeCsv(
      [
        {
          name: 'O,Brien',
          quote: 'she said "hi"',
          note: 'line1\nline2',
        },
      ],
      ['name', 'quote', 'note'],
    );
    expect(csv).toEqual(
      'name,quote,note\r\n"O,Brien","she said ""hi""","line1\nline2"',
    );
  });

  test('emits empty cells for missing values', () => {
    const csv = encodeCsv([{ a: 'x' }], ['a', 'b']);
    expect(csv).toEqual('a,b\r\nx,');
  });

  test('returns just the header when there is no data', () => {
    expect(encodeCsv([], ['a', 'b'])).toEqual('a,b');
  });
});

// eslint-disable-next-line no-restricted-globals -- TODO: Migrate from describe blocks
describe('buildCsvFileName', () => {
  test('formats the query id and timestamp into the expected pattern', () => {
    const date = new Date(2024, 0, 9, 7, 5); // Jan 9 2024 07:05 local time
    expect(buildCsvFileName('abc123', date)).toEqual(
      'sqllab-abc123-20240109-0705.csv',
    );
  });
});
