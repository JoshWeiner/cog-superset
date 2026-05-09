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

import { setValidatorTranslator, tr } from './i18n';

describe('validator i18n adapter', () => {
  // Reset the translator to the identity passthrough between tests so each
  // case starts from the package default.
  afterEach(() => {
    setValidatorTranslator(s => s);
  });

  test('falls back to the English passthrough until configured', () => {
    expect(tr('hello')).toBe('hello');
    expect(tr('with %s', 'arg')).toBe('with %s');
  });

  test('routes calls through the configured translator', () => {
    const calls: Array<[string, unknown[]]> = [];
    setValidatorTranslator((input, ...args) => {
      calls.push([input, args]);
      return `tr:${input}`;
    });
    expect(tr('hello')).toBe('tr:hello');
    expect(tr('greet %s', 'world')).toBe('tr:greet %s');
    expect(calls).toEqual([
      ['hello', []],
      ['greet %s', ['world']],
    ]);
  });

  test('supports replacing the configured translator', () => {
    setValidatorTranslator(() => 'first');
    expect(tr('x')).toBe('first');
    setValidatorTranslator(() => 'second');
    expect(tr('x')).toBe('second');
  });
});
