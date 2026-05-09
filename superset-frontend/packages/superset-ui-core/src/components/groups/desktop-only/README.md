<!--
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
-->

# Desktop-only component group

These components depend on web-only libraries (`ace-builds`, `brace`,
`ag-grid-community`, `ag-grid-react`, `react-syntax-highlighter`,
`react-markdown`). They **MUST NOT** be re-exported from any
mobile-eligible barrel.

Mobile bundles must be able to opt out of these dependencies entirely.
Importing this barrel pulls in heavy editor/grid/syntax-highlighting
runtimes that are unsuitable for mobile builds.

## Members

- `AsyncAceEditor` (and `CssEditor`, `JsonEditor`, `JSEditor`,
  `SQLEditor`, `FullSQLEditor`, `MarkdownEditor`, `TextAreaEditor`,
  `ConfigEditor`, plus the `AsyncAceEditorProps`, `Editor`, and
  `AceCompleterKeyword` types) — depends on `ace-builds`/`brace` via
  `react-ace`.
- `CodeEditor` (with `CodeEditorProps`, `CodeEditorMode`, and
  `CodeEditorTheme` types) — depends on `ace-builds` directly.
- `CodeSyntaxHighlighter` (re-exported from its folder) — depends on
  `react-syntax-highlighter`.
- `ThemedAgGridReact` (with `ThemedAgGridReactProps`,
  `AgGridContainerElement`, `setupAGGridModules`, `defaultModules`) —
  depends on `ag-grid-community` and `ag-grid-react`.

## Usage

```ts
import {
  AsyncAceEditor,
  CodeEditor,
  CodeSyntaxHighlighter,
  ThemedAgGridReact,
} from '@superset-ui/core/components/groups/desktop-only';
```

The flat `@superset-ui/core/components` barrel continues to expose
these symbols for backward compatibility; the desktop-only barrel
exists so that mobile-eligible barrels can clearly exclude them.
