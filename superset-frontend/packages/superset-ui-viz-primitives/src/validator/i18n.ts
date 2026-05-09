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

/**
 * Translator adapter for the validator module.
 *
 * The validator package is intended to be portable and must not depend on
 * the host application's translation runtime. Consumers wire in their
 * preferred translation implementation by calling `setValidatorTranslator`
 * at application bootstrap. Until configured, the adapter falls back to an
 * English passthrough that returns the input string unchanged.
 */

export type Translator = (input: string, ...args: unknown[]) => string;

let translator: Translator = (s: string) => s;

export const setValidatorTranslator = (t: Translator): void => {
  translator = t;
};

export const tr: Translator = (s: string, ...args: unknown[]): string =>
  translator(s, ...args);
