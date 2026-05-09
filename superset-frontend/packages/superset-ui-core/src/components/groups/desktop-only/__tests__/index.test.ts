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

/* eslint-disable import/first */
// Mock heavy web-only dependencies so importing the barrel does not
// pull real ace/brace/ag-grid/react-syntax-highlighter modules into
// the Jest worker. These jest.mock calls are hoisted above imports
// by babel-jest.
jest.mock('react-ace', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('ace-builds/src-noconflict/ace', () => ({
  config: { set: jest.fn() },
}));

jest.mock('ace-builds/src-min-noconflict/mode-handlebars', () => ({}), {
  virtual: true,
});
jest.mock('ace-builds/src-min-noconflict/mode-css', () => ({}), {
  virtual: true,
});
jest.mock('ace-builds/src-min-noconflict/mode-json', () => ({}), {
  virtual: true,
});
jest.mock('ace-builds/src-min-noconflict/mode-sql', () => ({}), {
  virtual: true,
});
jest.mock('ace-builds/src-min-noconflict/mode-markdown', () => ({}), {
  virtual: true,
});
jest.mock('ace-builds/src-min-noconflict/mode-javascript', () => ({}), {
  virtual: true,
});
jest.mock('ace-builds/src-min-noconflict/mode-html', () => ({}), {
  virtual: true,
});
jest.mock('ace-builds/src-noconflict/theme-github', () => ({}), {
  virtual: true,
});
jest.mock('ace-builds/src-noconflict/theme-monokai', () => ({}), {
  virtual: true,
});

jest.mock('ag-grid-react', () => ({
  AgGridReact: () => null,
}));

jest.mock('ag-grid-community', () => ({
  themeQuartz: { withPart: jest.fn().mockReturnThis(), withParams: jest.fn() },
  colorSchemeDark: {},
  colorSchemeLight: {},
  AllCommunityModule: {},
  ClientSideRowModelModule: {},
  ModuleRegistry: { registerModules: jest.fn() },
}));

jest.mock(
  'react-syntax-highlighter/dist/cjs/light',
  () =>
    function MockSyntaxHighlighter() {
      return null;
    },
);
jest.mock('react-syntax-highlighter/dist/cjs/styles/hljs/github', () => ({}));
jest.mock(
  'react-syntax-highlighter/dist/cjs/styles/hljs/tomorrow-night',
  () => ({}),
);

import * as desktopOnly from '../index';

test('desktop-only barrel re-exports AsyncAceEditor and friends', () => {
  expect(typeof desktopOnly.AsyncAceEditor).toBe('function');
  expect(desktopOnly.CssEditor).toBeDefined();
  expect(desktopOnly.JsonEditor).toBeDefined();
  expect(desktopOnly.JSEditor).toBeDefined();
  expect(desktopOnly.SQLEditor).toBeDefined();
  expect(desktopOnly.FullSQLEditor).toBeDefined();
  expect(desktopOnly.MarkdownEditor).toBeDefined();
  expect(desktopOnly.TextAreaEditor).toBeDefined();
  expect(desktopOnly.ConfigEditor).toBeDefined();
});

test('desktop-only barrel re-exports CodeEditor', () => {
  expect(desktopOnly.CodeEditor).toBeDefined();
});

test('desktop-only barrel re-exports CodeSyntaxHighlighter', () => {
  expect(desktopOnly.CodeSyntaxHighlighter).toBeDefined();
});

test('desktop-only barrel re-exports ThemedAgGridReact and helpers', () => {
  expect(desktopOnly.ThemedAgGridReact).toBeDefined();
  expect(typeof desktopOnly.setupAGGridModules).toBe('function');
  expect(Array.isArray(desktopOnly.defaultModules)).toBe(true);
});
