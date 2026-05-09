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

/*
 * Desktop-only component group barrel.
 *
 * The components re-exported here depend on web-only libraries
 * (ace-builds, brace, ag-grid-community, ag-grid-react,
 *  react-syntax-highlighter, react-markdown). They MUST NOT be
 * re-exported from any mobile-eligible barrel; mobile bundles must
 * be able to opt out of these dependencies entirely.
 *
 * Exports here mirror the existing flat component barrel so existing
 * consumers can migrate without behavior changes.
 */

export {
  AsyncAceEditor,
  CssEditor,
  JsonEditor,
  JSEditor,
  SQLEditor,
  FullSQLEditor,
  MarkdownEditor,
  TextAreaEditor,
  ConfigEditor,
  type AsyncAceEditorProps,
  type Editor,
  type AceCompleterKeyword,
} from '../../AsyncAceEditor';

export {
  CodeEditor,
  type CodeEditorProps,
  type CodeEditorMode,
  type CodeEditorTheme,
} from '../../CodeEditor';

export * from '../../CodeSyntaxHighlighter';

export {
  ThemedAgGridReact,
  type ThemedAgGridReactProps,
  type AgGridContainerElement,
  setupAGGridModules,
  defaultModules,
} from '../../ThemedAgGridReact';
