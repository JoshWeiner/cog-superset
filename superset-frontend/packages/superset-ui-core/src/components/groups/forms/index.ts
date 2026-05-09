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
 * Forms component group: text/boolean/number primitives and form
 * scaffolding. This barrel re-exports the public API of the underlying
 * components without modifying them, so it can serve as a stable
 * mobile-facing entry point for the Forms domain.
 */
export {
  Input,
  InputNumber,
  type InputProps,
  type TextAreaProps,
  type InputNumberProps,
  type InputRef,
  type TextAreaRef,
} from '../../Input';
export {
  Checkbox,
  type CheckboxProps,
  type CheckboxChangeEvent,
} from '../../Checkbox';
export {
  Radio,
  type RadioGroupWrapperProps,
  type RadioChangeEvent,
  type RadioGroupProps,
  type RadioProps,
  type CheckboxOptionType,
} from '../../Radio';
export { Switch, type SwitchProps } from '../../Switch';
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
  Upload,
  type UploadFile,
  type UploadChangeParam,
} from '../../Upload';
