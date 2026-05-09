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

# Form & Inputs

Category-level barrel for the **Form & Inputs** component group inside
`@superset-ui/core/components`.

This barrel groups together the primitive components and helpers that
collect data from the user — text fields, selectors, toggles, pickers,
form scaffolding, and editable labels — and re-exports them under a
single import path so consumers can opt into category-scoped imports as
the flat barrel is gradually decomposed.

## Components

| Export | Source |
| --- | --- |
| `Input` (and friends) | [`../../Input`](../../Input) |
| `Checkbox`, `CheckboxProps`, `CheckboxChangeEvent` | [`../../Checkbox`](../../Checkbox) |
| `Radio` (and friends) | [`../../Radio`](../../Radio) |
| `Switch`, `SwitchProps` | [`../../Switch`](../../Switch) |
| `Select` (and friends) | [`../../Select`](../../Select) |
| `AutoComplete`, `AutoCompleteProps` | [`../../AutoComplete`](../../AutoComplete) |
| `DatePicker` (and friends) | [`../../DatePicker`](../../DatePicker) |
| `TimezoneSelector` | [`../../TimezoneSelector`](../../TimezoneSelector) |
| `Form`, `FormItem`, `FormLabel`, `LabeledErrorBoundInput`, `FormInstance`, `FormProps`, `FormItemProps` | [`../../Form`](../../Form) |
| `Slider`, `SliderSingleProps`, `SliderRangeProps` | [`../../Slider`](../../Slider) |
| `ColorPicker`, `ColorPickerProps`, `RGBColor`, `ColorValue` | [`../../ColorPicker`](../../ColorPicker) |
| `TreeSelect`, `TreeSelectProps` | [`../../TreeSelect`](../../TreeSelect) |
| `Upload`, `UploadFile`, `UploadChangeParam` | [`../../Upload`](../../Upload) |
| `CronPicker`, `CronError` | [`../../CronPicker`](../../CronPicker) |
| `EditableTitle`, `EditableTitleProps` | [`../../EditableTitle`](../../EditableTitle) |
| `DynamicEditableTitle`, `DynamicEditableTitleProps` | [`../../DynamicEditableTitle`](../../DynamicEditableTitle) |

## Usage

```ts
import {
  Form,
  FormItem,
  Input,
  Select,
  Switch,
} from '@superset-ui/core/components/groups/form-inputs';
```

The flat barrel at
[`@superset-ui/core/components`](../../index.ts) continues to expose the
same components, so existing imports keep working — this category barrel
is purely additive.
