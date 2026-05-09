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

import { Dimension } from './types';

export type MeasureTextFn = (text: string, fontSize: number) => Dimension;

export interface ComputeMaxFontSizeFromMeasureInput {
  text: string;
  measure: MeasureTextFn;
  maxWidth?: number;
  maxHeight?: number;
  idealFontSize?: number;
}

function decreaseSizeUntil(
  startSize: number,
  computeDimension: (size: number) => Dimension,
  condition: (dimension: Dimension) => boolean,
): number {
  let size = startSize;
  let dimension = computeDimension(size);

  while (!condition(dimension)) {
    size -= 1;

    // Here if the size goes below zero most likely is because it
    // has additional style applied in which case we assume the user
    // knows what it's doing and we just let them use that.
    // Visually it works, although it could have another
    // check in place.
    if (size < 0) {
      size = startSize;
      break;
    }

    dimension = computeDimension(size);
  }

  return size;
}

/**
 * Portable version of `computeMaxFontSize` that takes a measurement
 * function instead of relying on the DOM. The measurement function is
 * invoked with `(text, fontSize)` and must return a `Dimension`.
 */
export default function computeMaxFontSizeFromMeasure(
  input: ComputeMaxFontSizeFromMeasureInput,
): number {
  const { text, measure, idealFontSize, maxWidth, maxHeight } = input;

  let size: number;
  if (idealFontSize !== undefined && idealFontSize !== null) {
    size = idealFontSize;
  } else if (maxHeight === undefined || maxHeight === null) {
    throw new Error(
      'You must specify at least one of maxHeight or idealFontSize',
    );
  } else {
    size = Math.floor(maxHeight);
  }

  const computeDimension = (fontSize: number) => measure(text, fontSize);

  if (maxWidth !== undefined && maxWidth !== null) {
    size = decreaseSizeUntil(
      size,
      computeDimension,
      dim => dim.width > 0 && dim.width <= maxWidth,
    );
  }

  if (maxHeight !== undefined && maxHeight !== null) {
    size = decreaseSizeUntil(
      size,
      computeDimension,
      dim => dim.height > 0 && dim.height <= maxHeight,
    );
  }

  return size;
}
