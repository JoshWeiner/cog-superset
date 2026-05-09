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

# Viz Primitives Extraction — File Inventory

Plan/spec doc supporting the **viz-primitives extraction** workstream. It classifies every TypeScript/JavaScript source file under three Apache-Superset frontend packages as **PORTABLE**, **SOFT-COUPLED**, or **WEB-ONLY**, and assigns each PORTABLE/SOFT-COUPLED file to one of the 13 extraction steps that will own moving it.

This document is the source of truth for the per-file inventory. It does **not** move or modify any source files. It is consumed by the subsequent steps in the workstream (`scaffold`, `validator-i18n decoupling`, `dimension DOM split`, `echarts-canvas split`, the per-domain moves, and the final CI guardrail) which will reference it when carving code out of the monorepo.

## Scope

Three directories are inventoried:

- `superset-frontend/packages/superset-ui-core/src/`
- `superset-frontend/packages/superset-ui-chart-controls/src/`
- `superset-frontend/plugins/plugin-chart-echarts/src/`

All `.ts`, `.tsx`, `.js`, and `.jsx` files (including tests, stories, and fixtures) are inventoried so the extraction plan has full visibility into what each move will and will not pull along.

## Classification rules

A file is classified by static analysis of its imports and identifier usage. The rules below match the workstream brief verbatim.

**PORTABLE** — none of the following appear in the file:

- imports of `react` or `react-dom`
- imports of `@emotion/*` / `emotion`
- imports of `antd` or `@ant-design/*`
- imports of `@apache-superset/core/{theme,translation,common,components,...}` (any subpath)
- runtime references to `document` / `window` / `navigator` / `HTMLElement`
- JSX (any `.tsx`/`.jsx` file that emits `<TagName …>` is treated as carrying an implicit React-runtime dependency)

**SOFT-COUPLED** — the file is otherwise PORTABLE _except_ that it touches one or both of these adapter-friendly seams:

- `t()` / `tn()` from `@apache-superset/core/translation` — replaceable by an injected i18n adapter (Step 2 unblocks Step 9 here)
- `SupersetTheme` / `useTheme` / `themeObject` from `@apache-superset/core/theme` — replaceable by an injected theme adapter
- `HTMLElement` / `HTMLDivElement` / `HTMLCanvasElement` used purely as a TypeScript type (no runtime DOM call) — covered by the Step 3 / Step 4 splits

**WEB-ONLY** — anything else: a genuine React, ReactDOM, antd, Emotion, DOM-runtime, or non-translation/non-theme `@apache-superset/core/*` dependency.

The classifier is intentionally conservative. A file with a single `react` import is WEB-ONLY even if the rest is pure logic — moving it would require a refactor that the per-step plan tracks separately.

**Method.** A small Python pass walks each file, parses its `import` / `export … from` / dynamic `import()` specifiers, scans for DOM globals (skipping comments and pure type positions), looks for soft signals (`t(`, `tn(`, `SupersetTheme`, `useTheme`), and detects JSX in `.tsx`/`.jsx` content. Each soft-coupling site is recorded with its 1-based line number.

## The 13-step extraction plan

The numbering below is the canonical workstream order. This document is **Step 1**'s deliverable; later steps reference its inventory.

| # | Name | Description |
| --- | --- | --- |
| 1 | **Scaffold** | Stand up the new `packages/superset-viz-primitives` workspace, package metadata, build/test config, and the inventory in this doc. **No source files move.** |
| 2 | **Validator-i18n decoupling** | Refactor every validator under `superset-ui-core/src/validator/` to take an injected `t`-equivalent so Step 9 can move them without dragging in `@apache-superset/core/translation`. |
| 3 | **Dimension DOM split** | Split `superset-ui-core/src/dimension/` into a pure-TS half (string/array primitives) and a DOM-using half (`svg/*`, `getMultipleTextDimensions`). The pure half is what Step 10 moves. |
| 4 | **Echarts-canvas split** | Inside `plugin-chart-echarts/src/utils/` and any per-chart `transformProps.ts` that touches `window` / canvas measurement, isolate the DOM-touching helpers from the pure option-builders so Step 12 can move the latter. |
| 5 | **Foundation move** | Move `models/`, `utils/`, `types/`, `dynamic-plugins/`, plus the chart-controls `types.ts`/`constants.ts`/`fixtures.ts` into the new package. These are the cross-cutting primitives every other step needs. |
| 6 | **Color move** | Move `superset-ui-core/src/color/`. Mostly leaf data + a pair of scale classes; depends only on `models` and `utils` from Step 5. |
| 7 | **Number / currency / math move** | Move `number-format/`, `currency-format/`, and `math-expression/` together — they share the formatter-registry pattern and are mutually independent of DOM. |
| 8 | **Time-format / time-comparison move** | Move `time-format/` and `time-comparison/` (date-fns / d3-time-format wrappers and the period-over-period helpers). |
| 9 | **Validator move** | Move `superset-ui-core/src/validator/` after Step 2 has decoupled it from `@apache-superset/core/translation`. |
| 10 | **Dimension move** | Move the pure half of `superset-ui-core/src/dimension/` produced by Step 3. |
| 11 | **Query move** | Move `superset-ui-core/src/query/` and the `superset-ui-chart-controls/src/operators/` post-processing operators — they describe `QueryContext` and post-processing pipelines, which are pure data shaping. |
| 12 | **Chart-types + echarts-utils move** | Move the per-chart pure transforms (`buildQuery.ts`, `transformProps.ts`, `transformers.ts`, `types.ts`, `constants.ts`, `defaults.ts`) plus the post-Step-4 portable half of `plugin-chart-echarts/src/utils/`. Also picks up the chart-types primitives from `superset-ui-core/src/chart/` and `chart-composition/`. |
| 13 | **CI guardrail** | Land a CI check (lint rule + dependency-cruiser config or equivalent) that fails the build if the new package gains a forbidden import (`react`, `react-dom`, `@emotion/*`, `antd`, non-soft `@apache-superset/core/*`, or a DOM global). |

## Summary counts

| Directory | PORTABLE | SOFT-COUPLED | WEB-ONLY | Total |
| --- | ---: | ---: | ---: | ---: |
| `superset-ui-core/src` | 250 | 19 | 357 | 626 |
| `superset-ui-chart-controls/src` | 41 | 9 | 25 | 75 |
| `plugin-chart-echarts/src` | 113 | 37 | 66 | 216 |
| **All three** | **404** | **65** | **448** | **917** |

Of the **404** PORTABLE and **65** SOFT-COUPLED files, **379** map to an extraction step (Steps 5–12) and **90** stay behind because they live inside web-only sibling subtrees that are not in scope for this workstream.

## Per-step inventory

Each row lists the file's repo-relative path, classification, every non-Node import it declares (relative imports included so the cross-package fan-out is visible), and the soft-coupling sites with line numbers when applicable.

### Step 1 — Scaffold

**2 file(s)** assigned to this step.

| File | Class | Immediate non-Node imports | Soft-coupling sites |
| --- | --- | --- | --- |
| `superset-frontend/packages/superset-ui-core/src/index.ts` | PORTABLE | `./chart`, `./chart-composition`, `./color`, `./connection`, `./currency-format`, `./dimension`, `./dynamic-plugins`, `./hooks`, `./math-expression`, `./models`, `./number-format`, `./query`, `./time-comparison`, `./time-format`, `./types`, `./ui-overrides`, `./utils`, `./validator` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/index.ts` | PORTABLE | `./BigNumber`, `./BoxPlot`, `./BoxPlot/transformProps`, `./Bubble`, `./Bubble/transformProps`, `./Funnel`, `./Funnel/transformProps`, `./Gantt`, `./Gantt/transformProps`, `./Gauge`, `./Gauge/transformProps`, `./Graph`, `./Graph/transformProps`, `./Heatmap`, `./Heatmap/transformProps`, `./Histogram`, `./Histogram/transformProps`, `./MixedTimeseries`, `./MixedTimeseries/transformProps`, `./Pie`, `./Pie/transformProps`, `./Radar`, `./Radar/transformProps`, `./Sankey`, `./Sankey/transformProps`, `./Sunburst`, `./Sunburst/transformProps`, `./Timeseries`, `./Timeseries/Area`, `./Timeseries/Regular/Bar`, `./Timeseries/Regular/Line`, `./Timeseries/Regular/Scatter`, `./Timeseries/Regular/SmoothLine`, `./Timeseries/Step`, `./Timeseries/constants`, `./Timeseries/transformProps`, `./Tree`, `./Tree/transformProps`, `./Treemap`, `./Treemap/transformProps`, `./Waterfall`, `./Waterfall/transformProps`, `./types`, `./utils/eChartOptionsSchema`, `./utils/safeEChartOptionsParser` | _(none)_ |

### Step 5 — Foundation move (utils, types, models, dynamic-plugins, connection types)

**37 file(s)** assigned to this step.

| File | Class | Immediate non-Node imports | Soft-coupling sites |
| --- | --- | --- | --- |
| `superset-frontend/packages/superset-ui-chart-controls/src/ace-builds.d.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/index.ts` | PORTABLE | `./components/ColumnOption`, `./components/ColumnTypeLabel/ColumnTypeLabel`, `./components/ControlHeader`, `./components/ControlSubSectionHeader`, `./components/Dropdown`, `./components/Menu`, `./components/MetricOption`, `./constants`, `./fixtures`, `./operators`, `./shared-controls`, `./types`, `./utils` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/dynamic-plugins/index.ts` | PORTABLE | `./shared-modules` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/models/ExtensibleFunction.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/models/Plugin.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/models/Preset.ts` | PORTABLE | `./Plugin` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/models/Registry.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/models/RegistryWithDefaultKey.ts` | PORTABLE | `./Registry` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/models/TypedRegistry.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/models/index.ts` | PORTABLE | `./ExtensibleFunction`, `./Plugin`, `./Preset`, `./Registry`, `./RegistryWithDefaultKey`, `./TypedRegistry` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/types/AgGrid.ts` | PORTABLE | `ag-grid-community` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/types/index.ts` | PORTABLE | `../currency-format`, `../number-format`, `../query/types`, `./AgGrid` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/types/react-syntax-highlighter.d.ts` | PORTABLE | `react-syntax-highlighter` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/utils/convertKeysToCamelCase.ts` | PORTABLE | `lodash` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/utils/dates.test.ts` | PORTABLE | `./dates` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/utils/dates.ts` | PORTABLE | `dayjs`, `dayjs/plugin/calendar`, `dayjs/plugin/customParseFormat`, `dayjs/plugin/duration`, `dayjs/plugin/localizedFormat`, `dayjs/plugin/relativeTime`, `dayjs/plugin/timezone`, `dayjs/plugin/updateLocale`, `dayjs/plugin/utc` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/utils/ensureIsArray.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/utils/ensureIsInt.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/utils/html.test.tsx` | PORTABLE | `./html` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/utils/html.tsx` | PORTABLE | `../types`, `xss` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/utils/index.ts` | PORTABLE | `./convertKeysToCamelCase`, `./copy`, `./ensureIsArray`, `./ensureIsInt`, `./featureFlags`, `./getSelectedText`, `./html`, `./isDefined`, `./isEqualArray`, `./isRequired`, `./lruCache`, `./makeSingleton`, `./merge`, `./promiseTimeout`, `./random`, `./removeDuplicates`, `./tooltip`, `./typedMemo`, `./withLabel` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/utils/isDefined.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/utils/isEqualArray.test.ts` | PORTABLE | `./isEqualArray` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/utils/isEqualArray.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/utils/isRequired.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/utils/lruCache.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/utils/makeSingleton.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/utils/merge.test.ts` | PORTABLE | `./merge` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/utils/merge.ts` | PORTABLE | `lodash` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/utils/promiseTimeout.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/utils/random.ts` | PORTABLE | `seedrandom` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/utils/rankedSearchCompare.test.ts` | PORTABLE | `./rankedSearchCompare` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/utils/rankedSearchCompare.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/utils/removeDuplicates.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/utils/tooltip.ts` | SOFT-COUPLED | `./html`, `@apache-superset/core/translation` | `translation pkg import`; `L40: t()/tn() call` |
| `superset-frontend/packages/superset-ui-core/src/utils/withLabel.test.ts` | PORTABLE | `./withLabel` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/utils/withLabel.ts` | PORTABLE | `../validator` | _(none)_ |

### Step 6 — Color move (`superset-ui-core/src/color`)

**31 file(s)** assigned to this step.

| File | Class | Immediate non-Node imports | Soft-coupling sites |
| --- | --- | --- | --- |
| `superset-frontend/packages/superset-ui-core/src/color/CategoricalColorNamespace.ts` | PORTABLE | `./CategoricalColorScale`, `./CategoricalSchemeRegistrySingleton`, `./stringifyAndTrim`, `./types`, `lodash` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/CategoricalColorScale.ts` | PORTABLE | `../models`, `../utils`, `./LabelsColorMapSingleton`, `./stringifyAndTrim`, `./types`, `./utils`, `d3-scale` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/CategoricalScheme.ts` | PORTABLE | `./ColorScheme` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/CategoricalSchemeRegistrySingleton.ts` | PORTABLE | `../utils/makeSingleton`, `./CategoricalScheme`, `./ColorSchemeRegistry`, `./colorSchemes/categorical/d3` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/ColorScheme.ts` | PORTABLE | `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/ColorSchemeRegistry.ts` | PORTABLE | `../models` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/LabelsColorMapSingleton.ts` | PORTABLE | `../utils`, `./CategoricalColorNamespace` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/SequentialScheme.ts` | PORTABLE | `./ColorScheme`, `d3-interpolate`, `d3-scale` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/SequentialSchemeRegistrySingleton.ts` | PORTABLE | `../utils/makeSingleton`, `./ColorSchemeRegistry`, `./SequentialScheme`, `./colorSchemes/sequential/d3` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/colorSchemes/categorical/airbnb.ts` | PORTABLE | `../../CategoricalScheme` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/colorSchemes/categorical/blueToGreen.ts` | PORTABLE | `../../CategoricalScheme`, `../../types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/colorSchemes/categorical/colorsOfRainbow.ts` | PORTABLE | `../../CategoricalScheme`, `../../types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/colorSchemes/categorical/d3.ts` | PORTABLE | `../../CategoricalScheme` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/colorSchemes/categorical/echarts.ts` | PORTABLE | `../../CategoricalScheme` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/colorSchemes/categorical/google.ts` | PORTABLE | `../../CategoricalScheme` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/colorSchemes/categorical/index.ts` | PORTABLE | `./airbnb`, `./blueToGreen`, `./colorsOfRainbow`, `./d3`, `./echarts`, `./google`, `./lyft`, `./modernSunset`, `./preset`, `./presetAndSuperset`, `./redToYellow`, `./superset`, `./wavesOfBlue` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/colorSchemes/categorical/lyft.ts` | PORTABLE | `../../CategoricalScheme` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/colorSchemes/categorical/modernSunset.ts` | PORTABLE | `../../CategoricalScheme`, `../../types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/colorSchemes/categorical/preset.ts` | PORTABLE | `../../CategoricalScheme`, `../../types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/colorSchemes/categorical/presetAndSuperset.ts` | PORTABLE | `../../CategoricalScheme`, `../../types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/colorSchemes/categorical/redToYellow.ts` | PORTABLE | `../../CategoricalScheme`, `../../types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/colorSchemes/categorical/superset.ts` | PORTABLE | `../../CategoricalScheme`, `../../types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/colorSchemes/categorical/wavesOfBlue.ts` | PORTABLE | `../../CategoricalScheme`, `../../types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/colorSchemes/index.ts` | PORTABLE | `./categorical`, `./sequential` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/colorSchemes/sequential/common.ts` | PORTABLE | `../../SequentialScheme` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/colorSchemes/sequential/d3.ts` | PORTABLE | `../../SequentialScheme` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/colorSchemes/sequential/index.ts` | PORTABLE | `./common`, `./d3` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/index.ts` | PORTABLE | `./CategoricalColorNamespace`, `./CategoricalColorScale`, `./CategoricalScheme`, `./CategoricalSchemeRegistrySingleton`, `./ColorScheme`, `./ColorSchemeRegistry`, `./LabelsColorMapSingleton`, `./SequentialScheme`, `./SequentialSchemeRegistrySingleton`, `./colorSchemes`, `./types`, `./utils` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/stringifyAndTrim.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/types.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/color/utils.ts` | PORTABLE | `tinycolor2` | _(none)_ |

### Step 7 — Number / currency / math move

**18 file(s)** assigned to this step.

| File | Class | Immediate non-Node imports | Soft-coupling sites |
| --- | --- | --- | --- |
| `superset-frontend/packages/superset-ui-core/src/currency-format/CurrencyFormats.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/currency-format/CurrencyFormatter.ts` | PORTABLE | `../models`, `../number-format`, `../query`, `./CurrencyFormats`, `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/currency-format/index.ts` | PORTABLE | `./CurrencyFormats`, `./CurrencyFormatter`, `./types`, `./utils` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/currency-format/types.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/currency-format/utils.ts` | PORTABLE | `./CurrencyFormats`, `./CurrencyFormatter`, `./types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/math-expression/index.ts` | PORTABLE | `math-expression-evaluator` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/number-format/D3FormatConfig.ts` | PORTABLE | `d3-format` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/number-format/NumberFormats.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/number-format/NumberFormatter.ts` | PORTABLE | `../models`, `../utils`, `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/number-format/NumberFormatterRegistry.ts` | PORTABLE | `../models`, `./D3FormatConfig`, `./NumberFormats`, `./NumberFormatter`, `./factories/createD3NumberFormatter`, `./factories/createSmartNumberFormatter`, `d3-format` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/number-format/NumberFormatterRegistrySingleton.ts` | PORTABLE | `../utils`, `./NumberFormatterRegistry`, `d3-format` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/number-format/factories/createD3NumberFormatter.ts` | PORTABLE | `../../utils`, `../D3FormatConfig`, `../NumberFormatter`, `../types`, `d3-format` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/number-format/factories/createDurationFormatter.ts` | PORTABLE | `../NumberFormatter`, `pretty-ms` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/number-format/factories/createMemoryFormatter.ts` | PORTABLE | `../NumberFormatter`, `../types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/number-format/factories/createSiAtMostNDigitFormatter.ts` | PORTABLE | `../D3FormatConfig`, `../NumberFormatter`, `d3-format` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/number-format/factories/createSmartNumberFormatter.ts` | PORTABLE | `../D3FormatConfig`, `../NumberFormats`, `../NumberFormatter`, `d3-format` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/number-format/index.ts` | PORTABLE | `./D3FormatConfig`, `./NumberFormats`, `./NumberFormatter`, `./NumberFormatterRegistry`, `./NumberFormatterRegistrySingleton`, `./factories/createD3NumberFormatter`, `./factories/createDurationFormatter`, `./factories/createMemoryFormatter`, `./factories/createSiAtMostNDigitFormatter`, `./factories/createSmartNumberFormatter` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/number-format/types.ts` | PORTABLE | _(none)_ | _(none)_ |

### Step 8 — Time-format / time-comparison move

**29 file(s)** assigned to this step.

| File | Class | Immediate non-Node imports | Soft-coupling sites |
| --- | --- | --- | --- |
| `superset-frontend/packages/superset-ui-core/src/time-comparison/customTimeRangeDecode.ts` | PORTABLE | `./fetchTimeRange`, `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-comparison/fetchTimeRange.ts` | PORTABLE | `@superset-ui/core`, `lodash`, `rison` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-comparison/getComparisonFilters.ts` | PORTABLE | `../query`, `../types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-comparison/getComparisonInfo.ts` | PORTABLE | `../query`, `./getComparisonFilters`, `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-comparison/getTimeOffset.ts` | PORTABLE | `../utils`, `./customTimeRangeDecode`, `lodash` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-comparison/index.ts` | PORTABLE | `./customTimeRangeDecode`, `./fetchTimeRange`, `./getComparisonFilters`, `./getComparisonInfo`, `./getTimeOffset`, `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-comparison/types.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-format/D3FormatConfig.ts` | PORTABLE | `d3-time-format` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-format/TimeFormats.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-format/TimeFormatsForGranularity.ts` | PORTABLE | `./TimeFormats`, `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-format/TimeFormatter.ts` | PORTABLE | `../models`, `../utils`, `./types`, `./utils/stringifyTimeInput` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-format/TimeFormatterRegistry.ts` | PORTABLE | `../models`, `./D3FormatConfig`, `./TimeFormats`, `./TimeFormatter`, `./factories/createD3TimeFormatter`, `d3-time-format` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-format/TimeFormatterRegistrySingleton.ts` | PORTABLE | `../utils`, `./TimeFormats`, `./TimeFormatsForGranularity`, `./TimeFormatter`, `./TimeFormatterRegistry`, `./TimeRangeFormatter`, `./types`, `./utils/createTimeRangeFromGranularity` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-format/TimeRangeFormatter.ts` | PORTABLE | `../models`, `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-format/factories/createD3TimeFormatter.ts` | PORTABLE | `../../utils`, `../TimeFormats`, `../TimeFormatter`, `d3-time-format` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-format/factories/createMultiFormatter.ts` | PORTABLE | `../TimeFormatter`, `../utils/d3Time`, `d3-time-format` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-format/formatters/finestTemporalGrain.test.ts` | PORTABLE | `./finestTemporalGrain` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-format/formatters/finestTemporalGrain.ts` | PORTABLE | `../TimeFormatter`, `../utils/d3Time`, `d3-time-format` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-format/formatters/smartDate.ts` | PORTABLE | `../factories/createMultiFormatter`, `d3-time-format` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-format/formatters/smartDateDetailed.ts` | PORTABLE | `../factories/createMultiFormatter`, `d3-time-format` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-format/formatters/smartDateVerbose.ts` | PORTABLE | `../factories/createMultiFormatter`, `d3-time-format` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-format/index.ts` | PORTABLE | `./D3FormatConfig`, `./TimeFormats`, `./TimeFormatter`, `./TimeFormatterRegistrySingleton`, `./factories/createD3TimeFormatter`, `./factories/createMultiFormatter`, `./formatters/finestTemporalGrain`, `./formatters/smartDate`, `./formatters/smartDateDetailed`, `./formatters/smartDateVerbose`, `./types`, `./utils/denormalizeTimestamp`, `./utils/normalizeTimestamp` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-format/types.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-format/utils/createTime.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-format/utils/createTimeRangeFromGranularity.ts` | PORTABLE | `../types`, `./createTime` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-format/utils/d3Time.ts` | PORTABLE | `d3-time` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-format/utils/denormalizeTimestamp.ts` | PORTABLE | `./normalizeTimestamp` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-format/utils/normalizeTimestamp.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/time-format/utils/stringifyTimeInput.ts` | PORTABLE | _(none)_ | _(none)_ |

### Step 9 — Validator move (depends on Step 2 — validator-i18n decoupling)

**11 file(s)** assigned to this step.

| File | Class | Immediate non-Node imports | Soft-coupling sites |
| --- | --- | --- | --- |
| `superset-frontend/packages/superset-ui-core/src/validator/index.ts` | PORTABLE | `./legacyValidateInteger`, `./legacyValidateNumber`, `./types`, `./validateInteger`, `./validateMapboxStylesUrl`, `./validateMaxValue`, `./validateNonEmpty`, `./validateNumber`, `./validateServerPagination`, `./validateTimeComparisonRangeValues` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/validator/legacyValidateInteger.ts` | SOFT-COUPLED | `@apache-superset/core/translation` | `translation pkg import`; `L31: t()/tn() call` |
| `superset-frontend/packages/superset-ui-core/src/validator/legacyValidateNumber.ts` | SOFT-COUPLED | `@apache-superset/core/translation` | `translation pkg import`; `L28: t()/tn() call` |
| `superset-frontend/packages/superset-ui-core/src/validator/types.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/validator/validateInteger.ts` | SOFT-COUPLED | `@apache-superset/core/translation` | `translation pkg import`; `L32: t()/tn() call` |
| `superset-frontend/packages/superset-ui-core/src/validator/validateMapboxStylesUrl.ts` | SOFT-COUPLED | `@apache-superset/core/translation` | `translation pkg import`; `L42: t()/tn() call` |
| `superset-frontend/packages/superset-ui-core/src/validator/validateMaxValue.ts` | SOFT-COUPLED | `@apache-superset/core/translation` | `translation pkg import`; `L26: t()/tn() call` |
| `superset-frontend/packages/superset-ui-core/src/validator/validateNonEmpty.ts` | SOFT-COUPLED | `@apache-superset/core/translation` | `translation pkg import`; `L29: t()/tn() call` |
| `superset-frontend/packages/superset-ui-core/src/validator/validateNumber.ts` | SOFT-COUPLED | `@apache-superset/core/translation` | `translation pkg import`; `L32: t()/tn() call` |
| `superset-frontend/packages/superset-ui-core/src/validator/validateServerPagination.ts` | SOFT-COUPLED | `@apache-superset/core/translation` | `translation pkg import`; `L32: t()/tn() call` |
| `superset-frontend/packages/superset-ui-core/src/validator/validateTimeComparisonRangeValues.ts` | SOFT-COUPLED | `../time-comparison`, `../utils`, `@apache-superset/core/translation` | `translation pkg import`; `L33: t()/tn() call` |

### Step 10 — Dimension move (depends on Step 3 — dimension DOM split)

**11 file(s)** assigned to this step.

| File | Class | Immediate non-Node imports | Soft-coupling sites |
| --- | --- | --- | --- |
| `superset-frontend/packages/superset-ui-core/src/dimension/computeMaxFontSize.ts` | PORTABLE | `./getTextDimension`, `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/dimension/getMultipleTextDimensions.ts` | SOFT-COUPLED | `./svg/factories`, `./svg/getBBoxCeil`, `./svg/updateTextNode`, `./types` | `L33: HTMLElement (type-only)` |
| `superset-frontend/packages/superset-ui-core/src/dimension/getTextDimension.ts` | SOFT-COUPLED | `./svg/factories`, `./svg/getBBoxCeil`, `./svg/updateTextNode`, `./types` | `L27: HTMLElement (type-only)` |
| `superset-frontend/packages/superset-ui-core/src/dimension/index.ts` | PORTABLE | `./computeMaxFontSize`, `./getMultipleTextDimensions`, `./getTextDimension`, `./mergeMargin`, `./parseLength`, `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/dimension/mergeMargin.ts` | PORTABLE | `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/dimension/parseLength.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/dimension/svg/constants.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/dimension/svg/factories.ts` | PORTABLE | `./LazyFactory`, `./createHiddenSvgNode`, `./createTextNode` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/dimension/svg/getBBoxCeil.ts` | PORTABLE | `../types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/dimension/svg/updateTextNode.ts` | PORTABLE | `../types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/dimension/types.ts` | PORTABLE | _(none)_ | _(none)_ |

### Step 11 — Query move

**58 file(s)** assigned to this step.

| File | Class | Immediate non-Node imports | Soft-coupling sites |
| --- | --- | --- | --- |
| `superset-frontend/packages/superset-ui-chart-controls/src/operators/aggregateOperator.ts` | PORTABLE | `./types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/operators/boxplotOperator.ts` | PORTABLE | `./types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/operators/contributionOperator.ts` | PORTABLE | `./types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/operators/flattenOperator.ts` | PORTABLE | `./types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/operators/histogramOperator.ts` | PORTABLE | `./types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/operators/index.ts` | PORTABLE | `./aggregateOperator`, `./boxplotOperator`, `./contributionOperator`, `./flattenOperator`, `./histogramOperator`, `./pivotOperator`, `./prophetOperator`, `./rankOperator`, `./renameOperator`, `./resampleOperator`, `./rollingWindowOperator`, `./sortOperator`, `./timeCompareOperator`, `./timeComparePivotOperator`, `./utils` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/operators/pivotOperator.ts` | PORTABLE | `./types`, `./utils`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/operators/prophetOperator.ts` | PORTABLE | `./types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/operators/rankOperator.ts` | PORTABLE | `./types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/operators/renameOperator.ts` | PORTABLE | `./types`, `./utils`, `./utils/constants`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/operators/resampleOperator.ts` | PORTABLE | `./types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/operators/sortOperator.ts` | PORTABLE | `./types`, `./utils`, `@superset-ui/core`, `lodash` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/operators/timeCompareOperator.ts` | PORTABLE | `./types`, `./utils`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/operators/timeComparePivotOperator.ts` | PORTABLE | `./types`, `./utils`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/operators/types.ts` | PORTABLE | `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/operators/utils/constants.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/operators/utils/extractExtraMetrics.ts` | PORTABLE | `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/operators/utils/getMetricOffsetsMap.ts` | PORTABLE | `../types`, `./constants`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/operators/utils/index.ts` | PORTABLE | `./constants`, `./extractExtraMetrics`, `./getMetricOffsetsMap`, `./isDerivedSeries`, `./isTimeComparison`, `./timeOffset` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/operators/utils/isDerivedSeries.ts` | PORTABLE | `./timeOffset`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/operators/utils/isTimeComparison.ts` | PORTABLE | `../types`, `./getMetricOffsetsMap`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/operators/utils/timeOffset.ts` | PORTABLE | `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/DatasourceKey.ts` | PORTABLE | `./types/Datasource` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/api/legacy/getDatasourceMetadata.ts` | PORTABLE | `../../../connection`, `../../types/Datasource`, `../types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/api/legacy/getFormData.ts` | PORTABLE | `../../../connection`, `../../types/QueryFormData`, `../types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/api/legacy/index.ts` | PORTABLE | `./getDatasourceMetadata`, `./getFormData`, `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/api/legacy/types.ts` | PORTABLE | `../../types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/api/types.ts` | PORTABLE | `../../connection` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/api/v1/handleError.ts` | PORTABLE | `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/api/v1/index.ts` | PORTABLE | `../../types`, `./makeApi` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/api/v1/makeApi.ts` | PORTABLE | `../../../connection`, `./handleError`, `./types`, `rison` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/api/v1/types.ts` | PORTABLE | `../../../connection` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/buildQueryContext.ts` | PORTABLE | `../chart`, `../connection`, `./DatasourceKey`, `./buildQueryObject`, `./getXAxis`, `./normalizeTimeColumn`, `./types/Query`, `./types/QueryFormData` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/buildQueryObject.ts` | PORTABLE | `../utils`, `./extractExtras`, `./extractQueryFields`, `./processExtraFormData`, `./processFilters`, `./types`, `./types/QueryFormData` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/constants.ts` | PORTABLE | `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/convertFilter.ts` | PORTABLE | `./types/Filter`, `./types/Query` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/extractExtras.ts` | PORTABLE | `./types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/extractQueryFields.ts` | SOFT-COUPLED | `../utils`, `./getColumnLabel`, `./getMetricLabel`, `./types/QueryFormData`, `@apache-superset/core/translation` | `translation pkg import`; `L121: t()/tn() call` |
| `superset-frontend/packages/superset-ui-core/src/query/extractTimegrain.ts` | PORTABLE | `../time-format`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/getClientErrorObject.ts` | SOFT-COUPLED | `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L99: t()/tn() call`; `L102: t()/tn() call`; `L135: t()/tn() call`; `L149: t()/tn() call`; `L150: t()/tn() call`; `L156: t()/tn() call`; `L184: t()/tn() call`; `L196: t()/tn() call`; `L205: t()/tn() call`; `L209: t()/tn() call`; `L261: t()/tn() call`; `L278: t()/tn() call`; `L281: t()/tn() call`; `L288: t()/tn() call` |
| `superset-frontend/packages/superset-ui-core/src/query/getColumnLabel.ts` | PORTABLE | `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/getMetricLabel.ts` | PORTABLE | `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/getXAxis.ts` | PORTABLE | `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/index.ts` | PORTABLE | `./DatasourceKey`, `./api/legacy`, `./api/v1`, `./api/v1/makeApi`, `./api/v1/types`, `./buildQueryContext`, `./buildQueryObject`, `./constants`, `./convertFilter`, `./extractQueryFields`, `./extractTimegrain`, `./getClientErrorObject`, `./getColumnLabel`, `./getMetricLabel`, `./getXAxis`, `./normalizeOrderBy`, `./normalizeTimeColumn`, `./types/AnnotationLayer`, `./types/Column`, `./types/Dashboard`, `./types/Datasource`, `./types/Metric`, `./types/Query`, `./types/QueryFormData` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/normalizeOrderBy.ts` | PORTABLE | `./types`, `lodash` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/normalizeTimeColumn.ts` | PORTABLE | `./getXAxis`, `./types`, `lodash` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/processExtraFormData.ts` | PORTABLE | `./constants`, `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/processFilters.ts` | PORTABLE | `./convertFilter`, `./types/Filter`, `./types/Query`, `./types/QueryFormData` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/types/AdvancedAnalytics.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/types/AnnotationLayer.ts` | PORTABLE | `../../time-format`, `./QueryResponse` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/types/Dashboard.ts` | PORTABLE | `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/types/Datasource.ts` | PORTABLE | `./Column`, `./Metric`, `nanoid` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/types/Filter.ts` | PORTABLE | `../../time-format`, `./Operator` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/types/Metric.ts` | PORTABLE | `../../types`, `./Column` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/types/Operator.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/types/QueryFormData.ts` | PORTABLE | `../../connection`, `../../time-format`, `./AnnotationLayer`, `./Column`, `./Filter`, `./Metric`, `./Operator`, `./Query`, `./Time` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/types/Time.ts` | PORTABLE | `./Query` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/query/types/index.ts` | PORTABLE | `./AdvancedAnalytics`, `./Column`, `./Dashboard`, `./Datasource`, `./Filter`, `./Metric`, `./Operator`, `./PostProcessing`, `./Query`, `./QueryFormData`, `./QueryResponse`, `./Time` | _(none)_ |

### Step 12 — Chart-types + echarts-utils move (depends on Step 4 — echarts-canvas split)

**182 file(s)** assigned to this step.

| File | Class | Immediate non-Node imports | Soft-coupling sites |
| --- | --- | --- | --- |
| `superset-frontend/packages/superset-ui-chart-controls/src/utils/D3Formatting.ts` | SOFT-COUPLED | `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L27: t()/tn() call`; `L31: t()/tn() call`; `L34: t()/tn() call`; `L55: t()/tn() call`; `L56: t()/tn() call`; `L58: t()/tn() call`; `L59: t()/tn() call`; `L60: t()/tn() call`; `L61: t()/tn() call`; `L62: t()/tn() call`; `L65: t()/tn() call`; `L69: t()/tn() call`; `L73: t()/tn() call`; `L78: t()/tn() call` |
| `superset-frontend/packages/superset-ui-chart-controls/src/utils/colorControls.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/utils/defineSavedMetrics.ts` | PORTABLE | `../types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/utils/displayTimeRelatedControls.ts` | PORTABLE | `../types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/utils/getStandardizedControls.ts` | PORTABLE | `../types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/utils/getTemporalColumns.ts` | PORTABLE | `@superset-ui/chart-controls`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/utils/index.ts` | PORTABLE | `./D3Formatting`, `./checkColumnType`, `./colorControls`, `./columnChoices`, `./defineSavedMetrics`, `./displayTimeRelatedControls`, `./expandControlConfig`, `./getColorFormatters`, `./getStandardizedControls`, `./getTemporalColumns`, `./mainMetric`, `./metricColumnFilter`, `./selectOptions` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/utils/mainMetric.ts` | PORTABLE | `../types` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/utils/metricColumnFilter.test.ts` | PORTABLE | `./metricColumnFilter`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/utils/metricColumnFilter.ts` | PORTABLE | `@superset-ui/core` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/utils/selectOptions.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/chart-composition/index.ts` | PORTABLE | `./ChartFrame`, `./legend/WithLegend`, `./tooltip/TooltipFrame`, `./tooltip/TooltipTable` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/chart/clients/ChartClient.ts` | PORTABLE | `../..`, `../registries/ChartBuildQueryRegistrySingleton`, `../registries/ChartMetadataRegistrySingleton`, `../types/Annotation`, `../types/Base`, `../types/QueryResponse` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/chart/components/Matrixify/MatrixifyGridGenerator.test.ts` | PORTABLE | `../../../query/types/Metric`, `./MatrixifyGridGenerator` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/chart/components/Matrixify/MatrixifyGridGenerator.ts` | PORTABLE | `../../../query`, `../../../query/types/Filter`, `../../types/matrixify`, `handlebars` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/chart/components/SuperChartCore.test.tsx` | PORTABLE | `./SuperChartCore`, `@superset-ui/core`, `@testing-library/react` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/chart/index.ts` | PORTABLE | `./clients/ChartClient`, `./components/ChartDataProvider`, `./components/StatefulChart`, `./components/SuperChart`, `./components/createLoadableRenderer`, `./components/reactify`, `./models/ChartMetadata`, `./models/ChartPlugin`, `./models/ChartProps`, `./registries/ChartBuildQueryRegistrySingleton`, `./registries/ChartComponentRegistrySingleton`, `./registries/ChartControlPanelRegistrySingleton`, `./registries/ChartMetadataRegistrySingleton`, `./registries/ChartTransformPropsRegistrySingleton`, `./types/Base`, `./types/QueryResponse`, `./types/TransformFunction`, `./types/VizType`, `./types/matrixify` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/chart/models/ChartControlPanel.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/chart/models/ChartMetadata.ts` | PORTABLE | `../../connection`, `../types/Base` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/chart/registries/ChartBuildQueryRegistrySingleton.ts` | PORTABLE | `../..` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/chart/registries/ChartComponentRegistrySingleton.ts` | PORTABLE | `../..`, `../models/ChartPlugin` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/chart/registries/ChartControlPanelRegistrySingleton.ts` | PORTABLE | `../..`, `../models/ChartControlPanel` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/chart/registries/ChartMetadataRegistrySingleton.ts` | PORTABLE | `../..`, `../models/ChartMetadata` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/chart/registries/ChartTransformPropsRegistrySingleton.ts` | PORTABLE | `../..`, `../types/TransformFunction` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/chart/types/Annotation.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/chart/types/Base.ts` | PORTABLE | `../..`, `../../query` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/chart/types/QueryResponse.ts` | PORTABLE | `../../types`, `./Base` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/chart/types/TransformFunction.ts` | PORTABLE | `../..`, `../models/ChartProps`, `./Base` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/chart/types/VizType.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/chart/types/matrixify.mocks.test.ts` | PORTABLE | `./matrixify.mocks` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/chart/types/matrixify.mocks.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/chart/types/matrixify.test.ts` | PORTABLE | `../../query/types/Metric`, `./matrixify` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/chart/types/matrixify.ts` | PORTABLE | `../../query` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/BigNumber/BigNumberPeriodOverPeriod/buildQuery.ts` | PORTABLE | `@superset-ui/chart-controls`, `@superset-ui/core`, `lodash` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/BigNumber/BigNumberPeriodOverPeriod/index.ts` | SOFT-COUPLED | `./buildQuery`, `./controlPanel`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `./transformProps`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L30: t()/tn() call`; `L33: t()/tn() call`; `L35: t()/tn() call`; `L36: t()/tn() call`; `L37: t()/tn() call`; `L38: t()/tn() call`; `L39: t()/tn() call`; `L40: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/BigNumber/BigNumberPeriodOverPeriod/transformProps.ts` | PORTABLE | `../utils`, `./utils`, `@superset-ui/chart-controls`, `@superset-ui/core`, `@superset-ui/core/utils/dates` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/BigNumber/BigNumberPeriodOverPeriod/types.ts` | PORTABLE | `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/BigNumber/BigNumberPeriodOverPeriod/utils.test.ts` | PORTABLE | `./utils` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/BigNumber/BigNumberPeriodOverPeriod/utils.ts` | PORTABLE | `../sharedControls` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/BigNumber/BigNumberTotal/buildQuery.ts` | PORTABLE | `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/BigNumber/BigNumberTotal/controlPanel.test.ts` | PORTABLE | `./controlPanel`, `@superset-ui/chart-controls`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/BigNumber/BigNumberTotal/index.ts` | SOFT-COUPLED | `../../types`, `../types`, `./buildQuery`, `./controlPanel`, `./images/BigNumber-dark.jpg`, `./images/BigNumber.jpg`, `./images/BigNumber2-dark.jpg`, `./images/BigNumber2.jpg`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `./transformProps`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L34: t()/tn() call`; `L35: t()/tn() call`; `L39: t()/tn() call`; `L40: t()/tn() call`; `L42: t()/tn() call`; `L44: t()/tn() call`; `L45: t()/tn() call`; `L46: t()/tn() call`; `L47: t()/tn() call`; `L48: t()/tn() call`; `L49: t()/tn() call`; `L50: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/BigNumber/BigNumberTotal/stories/data.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/BigNumber/BigNumberWithTrendline/buildQuery.test.ts` | PORTABLE | `./buildQuery`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/BigNumber/BigNumberWithTrendline/buildQuery.ts` | PORTABLE | `@superset-ui/chart-controls`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/BigNumber/BigNumberWithTrendline/index.ts` | SOFT-COUPLED | `../../types`, `../types`, `./buildQuery`, `./controlPanel`, `./images/Big_Number_Trendline-dark.jpg`, `./images/Big_Number_Trendline.jpg`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `./transformProps`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L35: t()/tn() call`; `L36: t()/tn() call`; `L40: t()/tn() call`; `L42: t()/tn() call`; `L43: t()/tn() call`; `L44: t()/tn() call`; `L45: t()/tn() call`; `L46: t()/tn() call`; `L47: t()/tn() call`; `L48: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/BigNumber/BigNumberWithTrendline/stories/data.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/BigNumber/constants.tsx` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/BigNumber/index.ts` | PORTABLE | `./BigNumberPeriodOverPeriod`, `./BigNumberTotal`, `./BigNumberWithTrendline` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/BigNumber/sharedControls.ts` | SOFT-COUPLED | `@apache-superset/core/translation`, `@superset-ui/chart-controls` | `translation pkg import`; `L25: t()/tn() call`; `L26: t()/tn() call`; `L27: t()/tn() call`; `L28: t()/tn() call`; `L29: t()/tn() call`; `L33: t()/tn() call`; `L34: t()/tn() call`; `L35: t()/tn() call`; `L36: t()/tn() call`; `L37: t()/tn() call`; `L50: t()/tn() call`; `L91: t()/tn() call`; `L93: t()/tn() call`; `L101: t()/tn() call`; `L104: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/BigNumber/types.ts` | PORTABLE | `../types`, `@superset-ui/chart-controls`, `@superset-ui/core`, `echarts/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/BigNumber/utils.ts` | PORTABLE | `@superset-ui/core`, `@superset-ui/core/utils/dates` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/BoxPlot/EchartsBoxPlot.tsx` | PORTABLE | `../components/Echart`, `../utils/eventHandlers`, `./types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/BoxPlot/buildQuery.ts` | PORTABLE | `./types`, `@superset-ui/chart-controls`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/BoxPlot/controlPanel.ts` | SOFT-COUPLED | `@apache-superset/core/translation`, `@superset-ui/chart-controls`, `@superset-ui/core` | `translation pkg import`; `L43: t()/tn() call`; `L89: t()/tn() call`; `L91: t()/tn() call`; `L95: t()/tn() call`; `L96: t()/tn() call`; `L97: t()/tn() call`; `L98: t()/tn() call`; `L99: t()/tn() call`; `L100: t()/tn() call`; `L109: t()/tn() call`; `L118: t()/tn() call`; `L120: t()/tn() call`; `L121: t()/tn() call`; `L124: t()/tn() call`; `L129: t()/tn() call`; `L139: t()/tn() call`; `L153: t()/tn() call`; `L167: t()/tn() call`; `L168: t()/tn() call`; `L171: t()/tn() call`; `L173: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/BoxPlot/index.ts` | SOFT-COUPLED | `../types`, `./buildQuery`, `./controlPanel`, `./images/BoxPlot-dark.jpg`, `./images/BoxPlot.jpg`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `./transformProps`, `./types`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L56: t()/tn() call`; `L58: t()/tn() call`; `L62: t()/tn() call`; `L63: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/BoxPlot/stories/data.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/BoxPlot/transformProps.ts` | PORTABLE | `../Timeseries/transformers`, `../constants`, `../defaults`, `../types`, `../utils/convertInteger`, `../utils/series`, `../utils/tooltip`, `./types`, `@superset-ui/core`, `echarts/charts`, `echarts/core`, `echarts/types/src/util/types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/BoxPlot/types.ts` | PORTABLE | `../constants`, `../types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Bubble/EchartsBubble.tsx` | PORTABLE | `../components/Echart`, `./types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Bubble/buildQuery.ts` | PORTABLE | `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Bubble/constants.ts` | PORTABLE | `../constants`, `../defaults`, `./types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Bubble/controlPanel.tsx` | SOFT-COUPLED | `../controls`, `../defaults`, `./constants`, `@apache-superset/core/translation`, `@superset-ui/chart-controls` | `translation pkg import`; `L43: t()/tn() call`; `L66: t()/tn() call`; `L79: t()/tn() call`; `L98: t()/tn() call`; `L107: t()/tn() call`; `L113: t()/tn() call`; `L122: t()/tn() call`; `L130: t()/tn() call`; `L145: t()/tn() call`; `L157: t()/tn() call`; `L166: t()/tn() call`; `L169: t()/tn() call`; `L176: t()/tn() call`; `L184: t()/tn() call`; `L197: t()/tn() call`; `L204: t()/tn() call`; `L217: t()/tn() call`; `L230: t()/tn() call`; `L233: t()/tn() call`; `L244: t()/tn() call`; `L247: t()/tn() call`; `L258: t()/tn() call`; `L261: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Bubble/index.ts` | SOFT-COUPLED | `./buildQuery`, `./controlPanel`, `./images/example1-dark.png`, `./images/example1.png`, `./images/example2-dark.png`, `./images/example2.png`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `./transformProps`, `./types`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L43: t()/tn() call`; `L45: t()/tn() call`; `L52: t()/tn() call`; `L54: t()/tn() call`; `L55: t()/tn() call`; `L56: t()/tn() call`; `L57: t()/tn() call`; `L58: t()/tn() call`; `L59: t()/tn() call`; `L60: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Bubble/stories/data.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Bubble/transformProps.ts` | PORTABLE | `../Timeseries/transformers`, `../constants`, `../defaults`, `../types`, `../utils/controls`, `../utils/convertInteger`, `../utils/legendLayout`, `../utils/series`, `../utils/tooltip`, `./constants`, `./types`, `@superset-ui/core`, `d3-array`, `echarts/charts`, `echarts/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Bubble/types.ts` | PORTABLE | `../types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Funnel/EchartsFunnel.tsx` | PORTABLE | `../components/Echart`, `../utils/eventHandlers`, `./types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Funnel/buildQuery.ts` | PORTABLE | `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Funnel/index.ts` | SOFT-COUPLED | `../types`, `./buildQuery`, `./controlPanel`, `./images/example-dark.jpg`, `./images/example.jpg`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `./transformProps`, `./types`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L56: t()/tn() call`; `L58: t()/tn() call`; `L62: t()/tn() call`; `L64: t()/tn() call`; `L65: t()/tn() call`; `L66: t()/tn() call`; `L67: t()/tn() call`; `L68: t()/tn() call`; `L69: t()/tn() call`; `L70: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Funnel/stories/constants.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Funnel/transformProps.ts` | PORTABLE | `../constants`, `../defaults`, `../types`, `../utils/legendLayout`, `../utils/series`, `../utils/tooltip`, `./types`, `@superset-ui/core`, `echarts/charts`, `echarts/core`, `echarts/types/src/util/types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Funnel/types.ts` | PORTABLE | `../constants`, `../types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Gantt/buildQuery.ts` | PORTABLE | `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Gantt/constants.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Gantt/index.ts` | SOFT-COUPLED | `../types`, `./buildQuery`, `./controlPanel`, `./images/example1-dark.png`, `./images/example1.png`, `./images/example2-dark.png`, `./images/example2.png`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `./transformProps`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L45: t()/tn() call`; `L46: t()/tn() call`; `L51: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Gantt/types.ts` | PORTABLE | `../types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Gauge/EchartsGauge.tsx` | PORTABLE | `../components/Echart`, `../utils/eventHandlers`, `./types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Gauge/buildQuery.ts` | PORTABLE | `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Gauge/constants.ts` | SOFT-COUPLED | `@apache-superset/core/theme`, `echarts/charts` | `theme pkg import`; `L19: SupersetTheme`; `L23: SupersetTheme` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Gauge/index.ts` | SOFT-COUPLED | `../types`, `./buildQuery`, `./controlPanel`, `./images/example1-dark.jpg`, `./images/example1.jpg`, `./images/example2-dark.jpg`, `./images/example2.jpg`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `./transformProps`, `./types`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L48: t()/tn() call`; `L50: t()/tn() call`; `L57: t()/tn() call`; `L59: t()/tn() call`; `L60: t()/tn() call`; `L61: t()/tn() call`; `L62: t()/tn() call`; `L63: t()/tn() call`; `L64: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Gauge/stories/data.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Gauge/transformProps.ts` | PORTABLE | `../constants`, `../types`, `../utils/controls`, `../utils/series`, `../utils/tooltip`, `./constants`, `./types`, `@superset-ui/core`, `echarts/charts`, `echarts/core`, `echarts/types/src/chart/gauge/GaugeSeries`, `echarts/types/src/util/types`, `lodash` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Gauge/types.ts` | PORTABLE | `../constants`, `../types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Graph/EchartsGraph.tsx` | PORTABLE | `../components/Echart`, `../types`, `../utils/series`, `./types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Graph/buildQuery.ts` | PORTABLE | `../utils/orderby`, `./types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Graph/constants.ts` | PORTABLE | `echarts/charts` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Graph/index.ts` | SOFT-COUPLED | `../types`, `./buildQuery`, `./controlPanel`, `./images/example-dark.jpg`, `./images/example.jpg`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `./transformProps`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L37: t()/tn() call`; `L39: t()/tn() call`; `L43: t()/tn() call`; `L45: t()/tn() call`; `L46: t()/tn() call`; `L47: t()/tn() call`; `L48: t()/tn() call`; `L49: t()/tn() call`; `L50: t()/tn() call`; `L51: t()/tn() call`; `L52: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Graph/stories/data.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Graph/transformProps.ts` | PORTABLE | `../types`, `../utils/legendLayout`, `../utils/series`, `../utils/tooltip`, `./constants`, `./types`, `@superset-ui/core`, `d3-array`, `echarts/charts`, `echarts/core`, `echarts/types/src/chart/graph/GraphSeries` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Graph/types.ts` | PORTABLE | `../constants`, `../types`, `@superset-ui/core`, `echarts/types/src/chart/graph/GraphSeries`, `echarts/types/src/util/types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Heatmap/Heatmap.tsx` | PORTABLE | `../components/Echart`, `./types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Heatmap/buildQuery.ts` | PORTABLE | `@superset-ui/chart-controls`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Heatmap/index.ts` | SOFT-COUPLED | `./buildQuery`, `./controlPanel`, `./images/example1-dark.png`, `./images/example1.png`, `./images/example2-dark.png`, `./images/example2.png`, `./images/example3-dark.png`, `./images/example3.png`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `./transformProps`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L34: t()/tn() call`; `L35: t()/tn() call`; `L43: t()/tn() call`; `L45: t()/tn() call`; `L46: t()/tn() call`; `L47: t()/tn() call`; `L48: t()/tn() call`; `L49: t()/tn() call`; `L50: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Heatmap/types.ts` | PORTABLE | `../types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Histogram/Histogram.tsx` | PORTABLE | `../components/Echart`, `../types`, `./types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Histogram/buildQuery.ts` | PORTABLE | `./types`, `@superset-ui/chart-controls`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Histogram/index.ts` | SOFT-COUPLED | `./buildQuery`, `./controlPanel`, `./images/example1-dark.png`, `./images/example1.png`, `./images/example2-dark.png`, `./images/example2.png`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `./transformProps`, `./types`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L55: t()/tn() call`; `L56: t()/tn() call`; `L66: t()/tn() call`; `L67: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Histogram/transformProps.ts` | PORTABLE | `../defaults`, `../types`, `../utils/formatters`, `../utils/series`, `../utils/tooltip`, `./types`, `@superset-ui/core`, `echarts/charts`, `echarts/components`, `echarts/core`, `echarts/types/src/util/types`, `lodash` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Histogram/types.ts` | PORTABLE | `../types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/MixedTimeseries/buildQuery.ts` | PORTABLE | `../utils/formDataSuffix`, `@superset-ui/chart-controls`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/MixedTimeseries/index.ts` | SOFT-COUPLED | `../types`, `./buildQuery`, `./controlPanel`, `./images/example-dark.jpg`, `./images/example.jpg`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `./transformProps`, `./types`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L59: t()/tn() call`; `L61: t()/tn() call`; `L71: t()/tn() call`; `L75: t()/tn() call`; `L76: t()/tn() call`; `L77: t()/tn() call`; `L78: t()/tn() call`; `L79: t()/tn() call`; `L80: t()/tn() call`; `L81: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/MixedTimeseries/stories/negativeData.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/MixedTimeseries/types.ts` | PORTABLE | `../constants`, `../types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Pie/EchartsPie.tsx` | PORTABLE | `../components/Echart`, `../utils/eventHandlers`, `./types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Pie/buildQuery.ts` | PORTABLE | `./utils`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Pie/constants.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Pie/index.ts` | SOFT-COUPLED | `../types`, `./buildQuery`, `./controlPanel`, `./images/Pie1-dark.jpg`, `./images/Pie1.jpg`, `./images/Pie2-dark.jpg`, `./images/Pie2.jpg`, `./images/Pie3-dark.jpg`, `./images/Pie3.jpg`, `./images/Pie4-dark.jpg`, `./images/Pie4.jpg`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `./transformProps`, `./types`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L62: t()/tn() call`; `L65: t()/tn() call`; `L74: t()/tn() call`; `L76: t()/tn() call`; `L77: t()/tn() call`; `L78: t()/tn() call`; `L79: t()/tn() call`; `L80: t()/tn() call`; `L81: t()/tn() call`; `L82: t()/tn() call`; `L83: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Pie/stories/data.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Pie/transformProps.ts` | SOFT-COUPLED | `../constants`, `../defaults`, `../types`, `../utils/convertInteger`, `../utils/legendLayout`, `../utils/series`, `../utils/tooltip`, `./types`, `./utils`, `@apache-superset/core/translation`, `@superset-ui/core`, `echarts/charts`, `echarts/core`, `echarts/types/src/util/types` | `translation pkg import`; `L223: t()/tn() call`; `L225: t()/tn() call`; `L477: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Pie/types.ts` | PORTABLE | `../constants`, `../types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Pie/utils.ts` | PORTABLE | `./constants` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Radar/EchartsRadar.tsx` | PORTABLE | `../components/Echart`, `../utils/eventHandlers`, `./types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Radar/buildQuery.ts` | PORTABLE | `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Radar/index.ts` | SOFT-COUPLED | `../types`, `./buildQuery`, `./controlPanel`, `./images/example1-dark.jpg`, `./images/example1.jpg`, `./images/example2-dark.jpg`, `./images/example2.jpg`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `./transformProps`, `./types`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L59: t()/tn() call`; `L61: t()/tn() call`; `L68: t()/tn() call`; `L70: t()/tn() call`; `L71: t()/tn() call`; `L72: t()/tn() call`; `L73: t()/tn() call`; `L74: t()/tn() call`; `L75: t()/tn() call`; `L76: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Radar/stories/data.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Radar/transformProps.ts` | PORTABLE | `../constants`, `../defaults`, `../types`, `../utils/legendLayout`, `../utils/series`, `../utils/tooltip`, `./types`, `./utils`, `@superset-ui/core`, `echarts/charts`, `echarts/core`, `echarts/types/src/chart/radar/RadarSeries`, `echarts/types/src/util/types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Radar/types.ts` | PORTABLE | `../constants`, `../types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Radar/utils.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Sankey/Sankey.tsx` | PORTABLE | `../components/Echart`, `./types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Sankey/buildQuery.ts` | PORTABLE | `./types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Sankey/controlPanel.tsx` | SOFT-COUPLED | `@apache-superset/core/translation`, `@superset-ui/chart-controls`, `@superset-ui/core` | `translation pkg import`; `L29: t()/tn() call`; `L37: t()/tn() call`; `L39: t()/tn() call`; `L52: t()/tn() call`; `L54: t()/tn() call`; `L69: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Sankey/index.ts` | SOFT-COUPLED | `./buildQuery`, `./controlPanel`, `./images/example1-dark.png`, `./images/example1.png`, `./images/example2-dark.png`, `./images/example2.png`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `./transformProps`, `./types`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L55: t()/tn() call`; `L56: t()/tn() call`; `L66: t()/tn() call`; `L67: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Sankey/transformProps.ts` | PORTABLE | `../types`, `../utils/formatters`, `../utils/tooltip`, `./types`, `@superset-ui/core`, `echarts/charts`, `echarts/core`, `echarts/types/src/util/types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Sankey/types.ts` | PORTABLE | `../types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Sunburst/buildQuery.ts` | PORTABLE | `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Sunburst/index.ts` | SOFT-COUPLED | `../types`, `./buildQuery`, `./controlPanel`, `./images/Sunburst1-dark.png`, `./images/Sunburst1.png`, `./images/Sunburst2-dark.png`, `./images/Sunburst2.png`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `./transformProps`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L44: t()/tn() call`; `L46: t()/tn() call`; `L53: t()/tn() call`; `L55: t()/tn() call`; `L56: t()/tn() call`; `L57: t()/tn() call`; `L58: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Sunburst/stories/data.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Sunburst/transformProps.ts` | SOFT-COUPLED | `../constants`, `../defaults`, `../types`, `../utils/series`, `../utils/tooltip`, `../utils/treeBuilder`, `./types`, `@apache-superset/core/translation`, `@superset-ui/core`, `echarts/core`, `echarts/types/src/util/types` | `translation pkg import`; `L137: t()/tn() call`; `L142: t()/tn() call`; `L389: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Sunburst/types.ts` | PORTABLE | `../types`, `@superset-ui/core`, `echarts/types/src/chart/sunburst/SunburstSeries` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/Area/index.ts` | SOFT-COUPLED | `../../types`, `../buildQuery`, `../transformProps`, `../types`, `./controlPanel`, `./images/Area1-dark.png`, `./images/Area1.png`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L55: t()/tn() call`; `L57: t()/tn() call`; `L67: t()/tn() call`; `L69: t()/tn() call`; `L70: t()/tn() call`; `L71: t()/tn() call`; `L72: t()/tn() call`; `L73: t()/tn() call`; `L74: t()/tn() call`; `L75: t()/tn() call`; `L76: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/Regular/Bar/index.ts` | SOFT-COUPLED | `../../../types`, `../../buildQuery`, `../../transformProps`, `../../types`, `./controlPanel`, `./images/Bar1-dark.png`, `./images/Bar1.png`, `./images/Bar2-dark.png`, `./images/Bar2.png`, `./images/Bar3-dark.png`, `./images/Bar3.png`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L63: t()/tn() call`; `L65: t()/tn() call`; `L79: t()/tn() call`; `L81: t()/tn() call`; `L82: t()/tn() call`; `L83: t()/tn() call`; `L84: t()/tn() call`; `L85: t()/tn() call`; `L86: t()/tn() call`; `L87: t()/tn() call`; `L88: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/Regular/Line/index.ts` | SOFT-COUPLED | `../../../types`, `../../buildQuery`, `../../transformProps`, `../../types`, `./controlPanel`, `./images/Line1-dark.png`, `./images/Line1.png`, `./images/Line2-dark.png`, `./images/Line2.png`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L61: t()/tn() call`; `L63: t()/tn() call`; `L77: t()/tn() call`; `L79: t()/tn() call`; `L80: t()/tn() call`; `L81: t()/tn() call`; `L82: t()/tn() call`; `L83: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/Regular/Scatter/index.ts` | SOFT-COUPLED | `../../../types`, `../../buildQuery`, `../../transformProps`, `../../types`, `./controlPanel`, `./images/Scatter1-dark.png`, `./images/Scatter1.png`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L59: t()/tn() call`; `L61: t()/tn() call`; `L71: t()/tn() call`; `L73: t()/tn() call`; `L74: t()/tn() call`; `L75: t()/tn() call`; `L76: t()/tn() call`; `L77: t()/tn() call`; `L78: t()/tn() call`; `L79: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/Regular/SmoothLine/index.ts` | SOFT-COUPLED | `../../../types`, `../../buildQuery`, `../../transformProps`, `../../types`, `./controlPanel`, `./images/SmoothLine1-dark.png`, `./images/SmoothLine1.png`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L59: t()/tn() call`; `L61: t()/tn() call`; `L71: t()/tn() call`; `L73: t()/tn() call`; `L74: t()/tn() call`; `L75: t()/tn() call`; `L76: t()/tn() call`; `L77: t()/tn() call`; `L78: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/Step/index.ts` | SOFT-COUPLED | `../..`, `../../types`, `../buildQuery`, `../transformProps`, `./controlPanel`, `./images/Step1-dark.png`, `./images/Step1.png`, `./images/Step2-dark.png`, `./images/Step2.png`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L48: t()/tn() call`; `L50: t()/tn() call`; `L63: t()/tn() call`; `L65: t()/tn() call`; `L66: t()/tn() call`; `L67: t()/tn() call`; `L68: t()/tn() call`; `L69: t()/tn() call`; `L70: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/constants.ts` | SOFT-COUPLED | `../defaults`, `../types`, `./types`, `@apache-superset/core/translation`, `@superset-ui/chart-controls` | `translation pkg import`; `L93: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/index.ts` | SOFT-COUPLED | `../types`, `./Regular/Line/controlPanel`, `./buildQuery`, `./images/Time-series_Chart-dark.jpg`, `./images/Time-series_Chart.jpg`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `./transformProps`, `./types`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L49: t()/tn() call`; `L51: t()/tn() call`; `L61: t()/tn() call`; `L63: t()/tn() call`; `L64: t()/tn() call`; `L65: t()/tn() call`; `L66: t()/tn() call`; `L67: t()/tn() call`; `L68: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/stories/AreaSeries/data.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/stories/confbandData.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/stories/data.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/stories/negativeNumData.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/stories/stackWithNulls.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/transformers.ts` | SOFT-COUPLED | `../constants`, `../types`, `../utils/annotation`, `../utils/forecast`, `../utils/series`, `@apache-superset/core/theme`, `@superset-ui/core`, `echarts`, `echarts/types/src/component/marker/MarkAreaModel`, `echarts/types/src/component/marker/MarkLineModel`, `echarts/types/src/util/types` | `theme pkg import`; `L33: SupersetTheme`; `L229: SupersetTheme`; `L494: SupersetTheme`; `L587: SupersetTheme` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Timeseries/types.ts` | PORTABLE | `../types`, `@superset-ui/core`, `echarts/types/src/util/types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Tree/EchartsTree.tsx` | PORTABLE | `../components/Echart`, `./types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Tree/buildQuery.ts` | PORTABLE | `../utils/orderby`, `./types`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Tree/constants.ts` | PORTABLE | `./types`, `echarts/charts` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Tree/index.ts` | SOFT-COUPLED | `../types`, `./buildQuery`, `./controlPanel`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `./images/tree-dark.png`, `./images/tree.png`, `./transformProps`, `@apache-superset/core/translation` | `translation pkg import`; `L36: t()/tn() call`; `L38: t()/tn() call`; `L42: t()/tn() call`; `L44: t()/tn() call`; `L45: t()/tn() call`; `L46: t()/tn() call`; `L47: t()/tn() call`; `L48: t()/tn() call`; `L49: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Tree/stories/data.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Tree/transformProps.ts` | PORTABLE | `../types`, `../utils/tooltip`, `./constants`, `./types`, `@superset-ui/core`, `echarts/charts`, `echarts/core`, `echarts/types/src/chart/tree/TreeSeries`, `echarts/types/src/util/types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Tree/types.ts` | PORTABLE | `../types`, `@superset-ui/core`, `echarts/types/src/chart/tree/TreeSeries`, `echarts/types/src/util/types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Treemap/buildQuery.ts` | PORTABLE | `../utils/orderby`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Treemap/constants.ts` | PORTABLE | `../types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Treemap/index.ts` | SOFT-COUPLED | `../types`, `./buildQuery`, `./controlPanel`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `./images/treemap_v2_1-dark.png`, `./images/treemap_v2_1.png`, `./images/treemap_v2_2-dark.jpg`, `./images/treemap_v2_2.jpg`, `./transformProps`, `./types`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L59: t()/tn() call`; `L61: t()/tn() call`; `L68: t()/tn() call`; `L70: t()/tn() call`; `L71: t()/tn() call`; `L72: t()/tn() call`; `L73: t()/tn() call`; `L74: t()/tn() call`; `L75: t()/tn() call`; `L76: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Treemap/stories/data.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Treemap/transformProps.ts` | PORTABLE | `../constants`, `../types`, `../utils/series`, `../utils/tooltip`, `../utils/treeBuilder`, `./constants`, `./types`, `@superset-ui/core`, `echarts/charts`, `echarts/core`, `echarts/types/src/chart/treemap/TreemapSeries` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Treemap/types.ts` | PORTABLE | `../types`, `@superset-ui/core`, `echarts/types/src/util/types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Waterfall/EchartsWaterfall.tsx` | PORTABLE | `../components/Echart`, `../types`, `./types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Waterfall/buildQuery.ts` | PORTABLE | `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Waterfall/constants.ts` | SOFT-COUPLED | `@apache-superset/core/translation` | `translation pkg import`; `L22: t()/tn() call`; `L23: t()/tn() call`; `L25: t()/tn() call`; `L26: t()/tn() call`; `L27: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Waterfall/index.ts` | SOFT-COUPLED | `./buildQuery`, `./controlPanel`, `./images/example1-dark.png`, `./images/example1.png`, `./images/example2-dark.png`, `./images/example2.png`, `./images/example3-dark.png`, `./images/example3.png`, `./images/thumbnail-dark.png`, `./images/thumbnail.png`, `./transformProps`, `./types`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L57: t()/tn() call`; `L58: t()/tn() call`; `L68: t()/tn() call`; `L69: t()/tn() call` |
| `superset-frontend/plugins/plugin-chart-echarts/src/Waterfall/stories/data.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/Waterfall/types.ts` | PORTABLE | `../types`, `@superset-ui/core`, `echarts/types/src/chart/bar/BarSeries`, `echarts/types/src/util/types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/defaults.ts` | PORTABLE | `./types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/utils/annotation.ts` | PORTABLE | `../MixedTimeseries/types`, `../types`, `@superset-ui/core`, `lodash` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/utils/controls.ts` | PORTABLE | `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/utils/convertInteger.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/utils/eChartOptionsSchema.ts` | PORTABLE | `zod` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/utils/eventHandlers.ts` | PORTABLE | `../types`, `./series`, `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/utils/forecast.ts` | PORTABLE | `../types`, `./series`, `@superset-ui/core`, `echarts/types/src/util/format`, `echarts/types/src/util/types` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/utils/formDataSuffix.ts` | PORTABLE | `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/utils/formatters.ts` | PORTABLE | `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/utils/legendLayout.ts` | SOFT-COUPLED | `../types`, `./series`, `@apache-superset/core/theme` | `theme pkg import`; `L19: SupersetTheme`; `L46: SupersetTheme` |
| `superset-frontend/plugins/plugin-chart-echarts/src/utils/mergeCustomEChartOptions.test.ts` | PORTABLE | `./eChartOptionsSchema`, `./mergeCustomEChartOptions` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/utils/mergeCustomEChartOptions.ts` | PORTABLE | `./eChartOptionsSchema`, `echarts/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/utils/metricDisplayName.ts` | PORTABLE | `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/utils/orderby.test.ts` | PORTABLE | `./orderby` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/utils/orderby.ts` | PORTABLE | `@superset-ui/core` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/utils/themeOverrides.test.ts` | PORTABLE | `./themeOverrides` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/utils/themeOverrides.ts` | PORTABLE | `lodash` | _(none)_ |
| `superset-frontend/plugins/plugin-chart-echarts/src/utils/treeBuilder.ts` | PORTABLE | `@superset-ui/core`, `lodash` | _(none)_ |

### Files staying behind — PORTABLE/SOFT but co-resident with web-only siblings

**90 file(s)** assigned to this step.

| File | Class | Immediate non-Node imports | Soft-coupling sites |
| --- | --- | --- | --- |
| `superset-frontend/packages/superset-ui-chart-controls/src/components/ColumnTypeLabel/type-icons/svgType.d.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/components/ControlSubSectionHeader.tsx` | SOFT-COUPLED | `@apache-superset/core/theme` | `theme pkg import` |
| `superset-frontend/packages/superset-ui-chart-controls/src/components/Dropdown.tsx` | PORTABLE | `@superset-ui/core/components` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/components/Menu.tsx` | PORTABLE | `@superset-ui/core/components` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/sections/annotationsAndLayers.tsx` | SOFT-COUPLED | `../types`, `@apache-superset/core/translation` | `translation pkg import`; `L25: t()/tn() call`; `L36: t()/tn() call` |
| `superset-frontend/packages/superset-ui-chart-controls/src/sections/echartsTimeSeriesQuery.tsx` | SOFT-COUPLED | `../shared-controls`, `../types`, `@apache-superset/core/translation` | `translation pkg import`; `L42: t()/tn() call`; `L48: t()/tn() call` |
| `superset-frontend/packages/superset-ui-chart-controls/src/sections/forecastInterval.tsx` | SOFT-COUPLED | `../types`, `../utils`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L34: t()/tn() call`; `L43: t()/tn() call`; `L46: t()/tn() call`; `L55: t()/tn() call`; `L58: t()/tn() call`; `L69: t()/tn() call`; `L72: t()/tn() call`; `L84: t()/tn() call`; `L86: t()/tn() call`; `L87: t()/tn() call`; `L88: t()/tn() call`; `L91: t()/tn() call`; `L103: t()/tn() call`; `L105: t()/tn() call`; `L106: t()/tn() call`; `L107: t()/tn() call`; `L110: t()/tn() call`; `L122: t()/tn() call`; `L124: t()/tn() call`; `L125: t()/tn() call`; `L126: t()/tn() call`; `L129: t()/tn() call` |
| `superset-frontend/packages/superset-ui-chart-controls/src/sections/index.ts` | PORTABLE | `./advancedAnalytics`, `./annotationsAndLayers`, `./chartTitle`, `./echartsTimeSeriesQuery`, `./forecastInterval`, `./matrixify`, `./sections`, `./timeComparison` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/sections/matrixify.tsx` | SOFT-COUPLED | `../types`, `@apache-superset/core/translation` | `translation pkg import`; `L23: t()/tn() call`; `L31: t()/tn() call`; `L44: t()/tn() call`; `L58: t()/tn() call`; `L62: t()/tn() call`; `L69: t()/tn() call`; `L72: t()/tn() call`; `L81: t()/tn() call`; `L85: t()/tn() call`; `L98: t()/tn() call`; `L100: t()/tn() call` |
| `superset-frontend/packages/superset-ui-chart-controls/src/sections/sections.tsx` | SOFT-COUPLED | `../types`, `@apache-superset/core/translation` | `translation pkg import`; `L26: t()/tn() call`; `L28: t()/tn() call`; `L42: t()/tn() call`; `L52: t()/tn() call`; `L54: t()/tn() call`; `L61: t()/tn() call`; `L63: t()/tn() call`; `L70: t()/tn() call`; `L72: t()/tn() call`; `L81: t()/tn() call`; `L83: t()/tn() call`; `L93: t()/tn() call`; `L98: t()/tn() call`; `L109: t()/tn() call` |
| `superset-frontend/packages/superset-ui-chart-controls/src/sections/timeComparison.tsx` | SOFT-COUPLED | `..`, `../types`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L30: t()/tn() call`; `L31: t()/tn() call`; `L32: t()/tn() call`; `L33: t()/tn() call`; `L34: t()/tn() call`; `L35: t()/tn() call`; `L36: t()/tn() call`; `L37: t()/tn() call`; `L38: t()/tn() call`; `L39: t()/tn() call`; `L40: t()/tn() call`; `L41: t()/tn() call`; `L42: t()/tn() call`; `L71: t()/tn() call`; `L73: t()/tn() call`; `L82: t()/tn() call`; `L83: t()/tn() call`; `L85: t()/tn() call`; `L103: t()/tn() call`; `L118: t()/tn() call`; `L133: t()/tn() call`; `L136: t()/tn() call`; `L137: t()/tn() call`; `L138: t()/tn() call`; `L139: t()/tn() call`; `L141: t()/tn() call` |
| `superset-frontend/packages/superset-ui-chart-controls/src/shared-controls/components/index.tsx` | PORTABLE | `./RadioButtonControl` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/shared-controls/index.ts` | PORTABLE | `./components`, `./customControls`, `./dndControls`, `./mixins`, `./sharedControls` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/shared-controls/matrixifyControls.test.ts` | PORTABLE | `../types`, `./matrixifyControls` | _(none)_ |
| `superset-frontend/packages/superset-ui-chart-controls/src/shared-controls/matrixifyControls.tsx` | SOFT-COUPLED | `../types`, `../utils`, `./dndControls`, `@apache-superset/core/translation`, `@superset-ui/core` | `translation pkg import`; `L86: t()/tn() call`; `L89: t()/tn() call`; `L92: t()/tn() call`; `L97: t()/tn() call`; `L106: t()/tn() call`; `L117: t()/tn() call`; `L118: t()/tn() call`; `L152: t()/tn() call`; `L181: t()/tn() call`; `L182: t()/tn() call`; `L199: t()/tn() call`; `L206: t()/tn() call`; `L207: t()/tn() call`; `L210: t()/tn() call`; `L211: t()/tn() call`; `L219: t()/tn() call`; `L220: t()/tn() call`; `L244: t()/tn() call`; `L247: t()/tn() call`; `L276: t()/tn() call`; `L288: t()/tn() call`; `L296: t()/tn() call`; `L297: t()/tn() call`; `L298: t()/tn() call`; `L306: t()/tn() call`; `L307: t()/tn() call`; `L316: t()/tn() call`; `L317: t()/tn() call`; `L324: t()/tn() call`; `L325: t()/tn() call`; `L348: t()/tn() call`; `L349: t()/tn() call`; `L362: t()/tn() call`; `L363: t()/tn() call`; `L372: t()/tn() call`; `L373: t()/tn() call` |
| `superset-frontend/packages/superset-ui-core/src/components/AsyncAceEditor/Tooltip.test.tsx` | PORTABLE | `./Tooltip` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/AsyncAceEditor/Tooltip.tsx` | PORTABLE | `dompurify` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/AsyncAceEditor/useJsonValidation.test.ts` | PORTABLE | `./useJsonValidation`, `@testing-library/react` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/AutoComplete/types.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/Breadcrumb/types.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/ButtonGroup/index.tsx` | PORTABLE | `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/CertifiedBadge/types.ts` | PORTABLE | `@superset-ui/core/components/Icons/types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/Checkbox/CheckboxIcons.tsx` | SOFT-COUPLED | `@apache-superset/core/theme` | `theme pkg import`; `L19: useTheme`; `L22: useTheme`; `L44: useTheme`; `L63: useTheme` |
| `superset-frontend/packages/superset-ui-core/src/components/Checkbox/types.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/Collapse/Collapse.test.tsx` | PORTABLE | `.`, `./types`, `@superset-ui/core/spec` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/Collapse/index.tsx` | PORTABLE | `./Collapse`, `./CollapseLabelInModal` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/CronPicker/types.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/DatePicker/types.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/DropdownContainer/index.tsx` | PORTABLE | `./DropdownContainer` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/DynamicEditableTitle/types.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/EditableTitle/types.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/FaveStar/types.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/Form/index.tsx` | PORTABLE | `./Form`, `./FormItem`, `./FormLabel`, `./LabeledErrorBoundInput` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/Form/types.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/Grid/types.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/IconTooltip/index.tsx` | PORTABLE | `../Button`, `../Tooltip`, `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/Icons/BaseIcon.tsx` | SOFT-COUPLED | `./types`, `@apache-superset/core/theme` | `theme pkg import`; `L20: useTheme`; `L49: useTheme` |
| `superset-frontend/packages/superset-ui-core/src/components/Label/index.tsx` | SOFT-COUPLED | `./reusable/DatasetTypeLabel`, `./reusable/PublishedLabel`, `./types`, `@apache-superset/core/theme`, `@emotion/react`, `@superset-ui/core/components/Tag` | `theme pkg import`; `L21: useTheme`; `L27: useTheme` |
| `superset-frontend/packages/superset-ui-core/src/components/Layout/types.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/List/types.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/Loading/types.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/MetadataBar/ContentType.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/MetadataBar/constants.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/MetadataBar/index.tsx` | PORTABLE | `./ContentType`, `./MetadataBar`, `./constants` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/Modal/index.ts` | PORTABLE | `./FormModal`, `./Modal` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/Table/cell-renderers/ActionCell/fixtures.ts` | PORTABLE | `./index`, `@storybook/addon-actions` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/Table/cell-renderers/BooleanCell/index.tsx` | PORTABLE | `@superset-ui/core/components` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/Table/cell-renderers/ButtonCell/ButtonCell.test.tsx` | PORTABLE | `../fixtures`, `./index`, `@superset-ui/core/spec` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/Table/cell-renderers/ButtonCell/index.tsx` | PORTABLE | `../../../Button`, `../../../Button/types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/Table/cell-renderers/NumericCell/NumericCell.test.tsx` | PORTABLE | `./index`, `@superset-ui/core/spec` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/Table/cell-renderers/fixtures.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/Table/sorters.test.ts` | PORTABLE | `./sorters` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/Table/sorters.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/Table/utils/utils.test.ts` | PORTABLE | `./utils`, `@superset-ui/core/spec` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/Table/utils/utils.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/TableView/index.ts` | PORTABLE | `./TableView` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/TableView/types.ts` | PORTABLE | `react-table` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/Tabs/index.ts` | PORTABLE | `./Tabs` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/ThemedAgGridReact/setupAGGridModules.test.ts` | PORTABLE | `./setupAGGridModules`, `ag-grid-community` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/ThemedAgGridReact/setupAGGridModules.ts` | PORTABLE | `ag-grid-community` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/TimezoneSelector/TimezoneOptionsCache.test.tsx` | PORTABLE | `./TimezoneOptionsCache`, `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/TimezoneSelector/TimezoneOptionsCache.ts` | PORTABLE | `../../utils/dates`, `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/TimezoneSelector/types.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/TreeSelect/TreeSelect.test.tsx` | PORTABLE | `.`, `@superset-ui/core/spec` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/Typography/Typography.test.tsx` | PORTABLE | `.`, `@superset-ui/core/spec` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/UnsavedChangesModal/UnsavedChangesModal.test.tsx` | SOFT-COUPLED | `.`, `@superset-ui/core/spec` | `L62: HTMLElement (type-only)`; `L87: HTMLElement (type-only)` |
| `superset-frontend/packages/superset-ui-core/src/components/assets/images/index.ts` | PORTABLE | `./loading.svg` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/assets/index.ts` | PORTABLE | `./images`, `./svgs` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/assets/svgs/index.ts` | PORTABLE | `./chart.svg`, `./error.svg` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/components/constants.ts` | SOFT-COUPLED | `@apache-superset/core/translation` | `translation pkg import`; `L25: t()/tn() call`; `L26: t()/tn() call`; `L27: t()/tn() call` |
| `superset-frontend/packages/superset-ui-core/src/connection/SupersetClient.ts` | PORTABLE | `./SupersetClientClass`, `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/connection/callApi/callApiAndParseWithTimeout.ts` | PORTABLE | `../types`, `./callApi`, `./parseResponse`, `./rejectAfterTimeout` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/connection/callApi/index.ts` | PORTABLE | `./callApiAndParseWithTimeout` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/connection/callApi/parseResponse.ts` | PORTABLE | `../types`, `json-bigint`, `lodash` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/connection/callApi/rejectAfterTimeout.ts` | PORTABLE | _(none)_ | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/connection/index.ts` | PORTABLE | `./SupersetClient`, `./SupersetClientClass`, `./callApi`, `./constants`, `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/connection/types.ts` | PORTABLE | `./SupersetClientClass` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/hooks/index.ts` | PORTABLE | `./useChangeEffect`, `./useComponentDidMount`, `./useComponentDidUpdate`, `./useElementOnScreen`, `./usePrevious`, `./useTruncation` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/hooks/useChangeEffect/index.ts` | PORTABLE | `./useChangeEffect` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/hooks/useChangeEffect/useChangeEffect.test.ts` | PORTABLE | `./useChangeEffect`, `@testing-library/react` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/hooks/useComponentDidMount/index.ts` | PORTABLE | `./useComponentDidMount` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/hooks/useComponentDidMount/useComponentDidMount.test.ts` | PORTABLE | `./useComponentDidMount`, `@testing-library/react` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/hooks/useComponentDidUpdate/index.ts` | PORTABLE | `./useComponentDidUpdate` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/hooks/useComponentDidUpdate/useComponentDidUpdate.test.ts` | PORTABLE | `./useComponentDidUpdate`, `@testing-library/react` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/hooks/useElementOnScreen/index.ts` | PORTABLE | `./useElementOnScreen` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/hooks/usePrevious/index.ts` | PORTABLE | `./usePrevious` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/hooks/usePrevious/usePrevious.test.ts` | PORTABLE | `./usePrevious`, `@testing-library/react` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/hooks/useTruncation/index.ts` | PORTABLE | `./useCSSTextTruncation`, `./useChildElementTruncation` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/ui-overrides/ExtensionsRegistry.ts` | PORTABLE | `../models`, `../utils`, `./types` | _(none)_ |
| `superset-frontend/packages/superset-ui-core/src/ui-overrides/index.tsx` | PORTABLE | `./ExtensionsRegistry`, `./types` | _(none)_ |

## Appendix A — WEB-ONLY breakdown

WEB-ONLY files do not move under this workstream. They are summarized here by primary reason category so reviewers can see where the bulk of the React/DOM coupling lives.

| Directory | react / react-dom | antd | @emotion | @apache-superset/core/* (non-soft) | DOM globals | implicit JSX | storybook | other |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `superset-ui-core/src` | 127 | 57 | 0 | 5 | 25 | 137 | 6 | 0 |
| `superset-ui-chart-controls/src` | 10 | 1 | 0 | 8 | 3 | 3 | 0 | 0 |
| `plugin-chart-echarts/src` | 13 | 0 | 0 | 21 | 5 | 11 | 16 | 0 |

## Appendix B — How the inventory was generated

The classification was produced by a one-shot Python pass that reads each file once and emits the per-file record used in the tables above. Re-running the pass against a future commit will refresh the inventory; the workstream's Step 13 CI guardrail subsumes this check by enforcing the rules at PR time once the new package exists.

Static analysis caveats reviewers should keep in mind:

- Type-only imports of DOM types (`HTMLElement`, `HTMLDivElement`, `HTMLCanvasElement`) are recorded as soft sites rather than web-only because they are erased at compile time and easily fenced behind interface boundaries.
- A `.tsx`/`.jsx` file that contains `<TagName …>` is marked WEB-ONLY even when it does not explicitly `import 'react'`, because the JSX runtime is React-only in this codebase.
- `@apache-superset/core/translation` and `@apache-superset/core/theme` are the only `@apache-superset/core/*` subpaths that count as soft couplings; every other subpath collapses to WEB-ONLY because it pulls in framework, container, or DOM components from the host application.
- Storybook stories (`*.stories.tsx`, `*/stories/*`) are always WEB-ONLY: even when they appear to be plain object literals, the Storybook decorators they reference depend on the React runtime.
