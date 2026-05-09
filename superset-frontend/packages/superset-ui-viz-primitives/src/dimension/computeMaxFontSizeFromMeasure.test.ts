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
import computeMaxFontSizeFromMeasure, {
  MeasureTextFn,
} from './computeMaxFontSizeFromMeasure';

const buildMeasure =
  (perCharWidth: number, lineHeight: number): MeasureTextFn =>
  (text, fontSize) => ({
    width: text.length * perCharWidth * fontSize,
    height: lineHeight * fontSize,
  });

test('reduces font size until the measured width fits within maxWidth', () => {
  const measure = buildMeasure(0.5, 1);

  expect(
    computeMaxFontSizeFromMeasure({
      text: 'hello',
      idealFontSize: 20,
      maxWidth: 30,
      measure,
    }),
  ).toBe(12);
});

test('uses floor(maxHeight) as the starting size when no idealFontSize is given', () => {
  const measure = buildMeasure(0.1, 1);

  expect(
    computeMaxFontSizeFromMeasure({
      text: 'a',
      maxHeight: 10.9,
      measure,
    }),
  ).toBe(10);
});

test('throws when neither maxHeight nor idealFontSize is provided', () => {
  const measure = buildMeasure(1, 1);

  expect(() =>
    computeMaxFontSizeFromMeasure({ text: 'x', maxWidth: 10, measure }),
  ).toThrow('You must specify at least one of maxHeight or idealFontSize');
});
