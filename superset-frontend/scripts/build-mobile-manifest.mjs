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

/**
 * build-mobile-manifest.mjs
 *
 * Scans superset-frontend/src/mobile-modules/* for barrel index.ts files,
 * extracts named exports via regex, reads each barrel's README.md for its
 * purpose, and writes docs/mobile/manifest.json.
 *
 * Usage:  node scripts/build-mobile-manifest.mjs
 *
 * No external dependencies required — uses only Node built-ins.
 */

import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const FRONTEND_ROOT = join(__dirname, '..');
const MODULES_DIR = join(FRONTEND_ROOT, 'src', 'mobile-modules');
const MANIFEST_PATH = join(FRONTEND_ROOT, 'docs', 'mobile', 'manifest.json');

/**
 * Extract named exports from a barrel index.ts file.
 *
 * Handles patterns like:
 *   export { Foo, type Bar } from '...';
 *   export { default as Baz } from '...';
 *   export type { Qux } from '...';
 *   export * from '...';            (recorded as "*")
 */
function parseExports(source) {
  const exports = [];

  // Match: export { ... } from '...';  and  export type { ... } from '...';
  const braceRe = /export\s+(?:type\s+)?\{([^}]+)\}/g;
  let match;
  while ((match = braceRe.exec(source)) !== null) {
    const inner = match[1];
    for (const token of inner.split(',')) {
      const trimmed = token.trim();
      if (!trimmed) continue;

      // "default as Name" → Name
      const asMatch = trimmed.match(/default\s+as\s+(\w+)/);
      if (asMatch) {
        exports.push(asMatch[1]);
        continue;
      }

      // "type Foo" → Foo  (type-only re-export inside a value export block)
      const typeMatch = trimmed.match(/^type\s+(\w+)/);
      if (typeMatch) {
        exports.push(typeMatch[1]);
        continue;
      }

      // plain identifier
      const plain = trimmed.match(/^(\w+)/);
      if (plain) {
        exports.push(plain[1]);
      }
    }
  }

  // Match: export * from '...';
  const starRe = /export\s+\*\s+from\s+['"][^'"]+['"]/g;
  while (starRe.exec(source) !== null) {
    exports.push('*');
  }

  return exports;
}

/**
 * Extract the first non-empty, non-heading, non-HTML-comment paragraph
 * from a Markdown file as the bundle purpose.
 */
function extractPurpose(markdown) {
  const lines = markdown.split('\n');
  let paragraph = [];
  let inComment = false;

  for (const line of lines) {
    // Skip HTML comment blocks (license headers)
    if (line.includes('<!--')) {
      inComment = true;
    }
    if (inComment) {
      if (line.includes('-->')) {
        inComment = false;
      }
      continue;
    }

    const trimmed = line.trim();

    // Skip headings
    if (trimmed.startsWith('#')) {
      if (paragraph.length > 0) break;
      continue;
    }

    // Blank line ends a paragraph
    if (trimmed === '') {
      if (paragraph.length > 0) break;
      continue;
    }

    paragraph.push(trimmed);
  }

  return paragraph.join(' ');
}

async function main() {
  let dirs;
  try {
    dirs = await readdir(MODULES_DIR);
  } catch {
    // No mobile-modules directory yet — emit empty manifest
    dirs = [];
  }

  const bundles = [];

  for (const name of dirs.sort()) {
    const moduleDir = join(MODULES_DIR, name);
    const moduleStat = await stat(moduleDir);
    if (!moduleStat.isDirectory()) continue;

    const indexPath = join(moduleDir, 'index.ts');
    let indexSource;
    try {
      indexSource = await readFile(indexPath, 'utf8');
    } catch {
      // No index.ts — skip this directory
      continue;
    }

    const exports = parseExports(indexSource);

    let purpose = '';
    const readmePath = join(moduleDir, 'README.md');
    try {
      const readme = await readFile(readmePath, 'utf8');
      purpose = extractPurpose(readme);
    } catch {
      // No README — leave purpose empty
    }

    bundles.push({
      bundle: name,
      path: relative(FRONTEND_ROOT, moduleDir),
      exports,
      purpose,
      readme: relative(FRONTEND_ROOT, readmePath),
    });
  }

  const manifest = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    description:
      'Machine-readable manifest of every mobile-modules barrel in the repository.',
    generatedBy: 'scripts/build-mobile-manifest.mjs',
    bundles,
  };

  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');

  const count = bundles.length;
  const names = bundles.map(b => b.bundle).join(', ');
  console.log(
    `manifest.json written with ${count} bundle(s)${count ? `: ${names}` : ''}.`,
  );
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
