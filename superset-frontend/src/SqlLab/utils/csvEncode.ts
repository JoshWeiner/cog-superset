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

const SPECIAL_CHARS = /[",\r\n]/;

/**
 * Encode a single CSV field per RFC 4180. Wraps the value in double quotes
 * when it contains a comma, double quote, CR, or LF, doubling any embedded
 * double quotes.
 */
export const encodeCsvField = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }
  const stringValue =
    typeof value === 'string' ? value : JSON.stringify(value) ?? String(value);
  if (SPECIAL_CHARS.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

/**
 * Encode a tabular result set as a CSV string with a header row, using CRLF
 * line endings per RFC 4180.
 */
export const encodeCsv = (
  data: Record<string, unknown>[],
  columns: string[],
): string => {
  const lines: string[] = [];
  if (columns.length) {
    lines.push(columns.map(encodeCsvField).join(','));
  }
  for (const row of data) {
    lines.push(columns.map(column => encodeCsvField(row?.[column])).join(','));
  }
  return lines.join('\r\n');
};

/**
 * Build the SQL Lab CSV file name in the form
 * `sqllab-<query-id>-<yyyymmdd-hhmm>.csv`. Uses local time so the timestamp
 * matches the user's wall clock when downloading.
 */
export const buildCsvFileName = (queryId: string, date: Date = new Date()) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `sqllab-${queryId}-${yyyy}${mm}${dd}-${hh}${min}.csv`;
};
