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
 * Category-level barrel for the "Form & Inputs" component group.
 *
 * Re-exports the named exports (and matching public types) currently
 * exposed by `@superset-ui/core/components` for form & input primitives.
 * Mirrors the entries in `../../index.ts` verbatim so consumers can
 * gradually migrate to category-scoped imports without changing surface area.
 */

export * from '../../Input';
export {
  Checkbox,
  type CheckboxProps,
  type CheckboxChangeEvent,
} from '../../Checkbox';
export * from '../../Radio';
export { Switch, type SwitchProps } from '../../Switch';
export * from '../../Select';
export { AutoComplete, type AutoCompleteProps } from '../../AutoComplete';
export * from '../../DatePicker';
export { default as TimezoneSelector } from '../../TimezoneSelector';
export {
  Form,
  FormItem,
  FormLabel,
  LabeledErrorBoundInput,
  type FormInstance,
  type FormProps,
  type FormItemProps,
} from '../../Form';
export {
  default as Slider,
  type SliderSingleProps,
  type SliderRangeProps,
} from '../../Slider';
export {
  ColorPicker,
  type ColorPickerProps,
  type RGBColor,
  type ColorValue,
} from '../../ColorPicker';
export { TreeSelect, type TreeSelectProps } from '../../TreeSelect';
export { Upload, type UploadFile, type UploadChangeParam } from '../../Upload';
export { CronPicker, type CronError } from '../../CronPicker';
export { EditableTitle, type EditableTitleProps } from '../../EditableTitle';
export {
  DynamicEditableTitle,
  type DynamicEditableTitleProps,
} from '../../DynamicEditableTitle';
