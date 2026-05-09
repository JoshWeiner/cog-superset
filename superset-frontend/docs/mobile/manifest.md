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

# Mobile-Modules Manifest

`docs/mobile/manifest.json` is a machine-readable inventory of every
barrel module under `src/mobile-modules/`. Downstream tooling (bundlers,
CI checks, documentation generators) can consume it to discover which
bundles exist, what they export, and why they exist.

## Schema

Each entry in the `bundles` array has the following shape:

| Field     | Type       | Description                                                       |
| --------- | ---------- | ----------------------------------------------------------------- |
| `bundle`  | `string`   | Directory name under `src/mobile-modules/`.                       |
| `path`    | `string`   | Relative path from `superset-frontend/` to the barrel directory.  |
| `exports` | `string[]` | Named symbols exported by the barrel's `index.ts`.                |
| `purpose` | `string`   | First paragraph of the barrel's `README.md`.                      |
| `readme`  | `string`   | Relative path from `superset-frontend/` to the barrel's README.   |

## Regenerating the manifest

```bash
node scripts/build-mobile-manifest.mjs
```

The script uses only Node built-in modules (`node:fs/promises`,
`node:path`, `node:url`) and requires no additional dependencies. It:

1. Scans `src/mobile-modules/*/index.ts` for barrel directories.
2. Extracts named exports from each `index.ts` via regex.
3. Reads the first paragraph of each barrel's `README.md` as the purpose.
4. Writes `docs/mobile/manifest.json`.

Run the script after adding, removing, or modifying a barrel under
`src/mobile-modules/` to keep the manifest in sync.

## Adding a new barrel

1. Create a directory under `src/mobile-modules/<name>/`.
2. Add an `index.ts` with the barrel's re-exports.
3. Add a `README.md` whose first non-heading paragraph describes the
   bundle's purpose.
4. Run `node scripts/build-mobile-manifest.mjs` to regenerate the
   manifest.
5. Commit both the new barrel and the updated `manifest.json`.
