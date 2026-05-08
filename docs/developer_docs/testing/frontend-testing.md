---
title: Frontend Testing
sidebar_position: 2
---

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

# Frontend Testing

🚧 **Coming Soon** 🚧

Comprehensive guide for testing Superset's frontend components and features.

## Topics to be covered:

- Jest configuration and setup
- React Testing Library best practices
- Component testing strategies
- Redux store testing
- Async operations and API mocking
- Snapshot testing guidelines
- Coverage requirements and reporting
- Debugging test failures
- Performance testing for UI components

## Quick Commands

All frontend test commands are run from the `superset-frontend/` directory.

```bash
cd superset-frontend

# Run all frontend tests
npm run test

# Run tests in watch mode (TDD loop)
npm run tdd

# Re-run tests with full console output (no --silent)
npm run test-loud

# Run tests with coverage
npm run cover
```

## Targeted Test Commands

`npm run test` is a thin wrapper around Jest, so any flag after `--` is
forwarded straight through. Use these to scope a run to just the files or
test names you are working on. Long-form Jest flags are used so each
command is self-documenting; the equivalent short flag is shown in the
comment above each example.

> Note: `npm run test` runs Jest with `--silent`, which suppresses
> `console.log` output. Use `npm run test-loud` (or pass `--verbose`) when
> you need full Jest output while iterating.

```bash
cd superset-frontend

# Run a single test file by path
npm run test-loud -- src/components/ListView/ListView.test.tsx

# Run every test file whose path matches a regex (Jest positional arg)
npm run test-loud -- ListView

# Filter by a Jest test-name pattern (short form: -t "renders")
npm run test-loud -- ListView --testNamePattern="renders"

# Run tests for a single workspace package
npm run test-loud -- packages/superset-ui-core

# Re-run only the tests that failed on the previous run, with full output
npm run test-loud -- --onlyFailures --verbose

# Update snapshots for the targeted file (short form: -u)
npm run test-loud -- src/components/ListView/ListView.test.tsx --updateSnapshot

# Watch mode scoped to a file or pattern, with verbose Jest output
npm run tdd -- ListView --verbose
```

### Coverage for a Single Area

```bash
cd superset-frontend

# Coverage for everything (writes to coverage/ at the workspace root)
npm run cover

# 100% coverage gate for the @superset-ui packages (matches CI)
npm run core:cover

# Coverage for a single file or directory, with verbose Jest output
npm run test-loud -- --coverage --verbose src/components/ListView
```

---

*This documentation is under active development. Check back soon for updates!*
