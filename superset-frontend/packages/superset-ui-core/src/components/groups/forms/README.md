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

# Forms

Forms: text/boolean/number primitives and form scaffolding.

This package is a thin barrel that re-exports the public API of existing
form-related components from `@superset-ui/core/components`. It exists to
provide a stable, narrowly-scoped entry point that can be consumed by
mobile-facing layers (or alternative renderers) without having to depend
on the full component index. No behavior is changed — every export here
is a direct re-export of an existing component or type.

## Members

| Member | Source |
| --- | --- |
| `Input`, `InputNumber` (and related types `InputProps`, `TextAreaProps`, `InputNumberProps`, `InputRef`, `TextAreaRef`) | `../../Input` |
| `Checkbox` (and `CheckboxProps`, `CheckboxChangeEvent`) | `../../Checkbox` |
| `Radio` (and `RadioGroupWrapperProps`, `RadioChangeEvent`, `RadioGroupProps`, `RadioProps`, `CheckboxOptionType`) | `../../Radio` |
| `Switch` (and `SwitchProps`) | `../../Switch` |
| `Form`, `FormItem`, `FormLabel`, `LabeledErrorBoundInput` (and `FormInstance`, `FormProps`, `FormItemProps`) | `../../Form` |
| `Slider` (and `SliderSingleProps`, `SliderRangeProps`) | `../../Slider` |
| `Upload` (and `UploadFile`, `UploadChangeParam`) | `../../Upload` |

## Mobile considerations

The members of this group are currently web-only Ant Design wrappers.
A mobile renderer will need to provide shims or alternative implementations
for several capabilities that have no direct React Native equivalent:

- **`Form` / `Form.useForm()`** — AntD's imperative form instance
  (`FormInstance`, `useForm`) and the surrounding `Form` / `FormItem`
  validation pipeline are tied to the web DOM and AntD's internals. There
  is no React Native equivalent; a mobile target needs either a separate
  form-state library (e.g. `react-hook-form`) behind the same public
  surface, or a thin shim that adapts `FormInstance` semantics to a
  native form store.
- **`Upload` drag-and-drop and file dialog** — `Upload` relies on
  `<input type="file">`, drag-and-drop events, and the browser file
  picker, all of which are web-only. On mobile this needs a shim backed
  by a native picker (camera roll, document picker, share sheet) and a
  different progress/preview surface.
- **`Slider` pointer events** — AntD's `Slider` uses `pointerdown` /
  `pointermove` / `pointerup` events that do not exist in React Native.
  A mobile implementation needs to map gesture events (e.g.
  `PanResponder` or `react-native-gesture-handler`) to the same
  controlled value contract.
- **`Input`, `InputNumber`, `Checkbox`, `Radio`, `Switch`** — these are
  conceptually portable but render DOM elements today. A mobile target
  must substitute the underlying primitive (`TextInput`, `Switch`, etc.)
  while preserving the exported prop shapes used here.
