---
title: Overview
sidebar_position: 1
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

# Overview

Apache Superset follows a comprehensive testing strategy that ensures code quality, reliability, and maintainability. This section covers all aspects of testing in the Superset ecosystem, from unit tests to end-to-end testing workflows.

## Testing Philosophy

Superset embraces a testing pyramid approach:

- **Unit Tests**: Fast, isolated tests for individual components and functions
- **Integration Tests**: Tests that verify component interactions and API endpoints
- **End-to-End Tests**: Full user journey testing in browser environments

## Testing Documentation

### Frontend Testing
- **[Frontend Testing](./frontend-testing)** - Jest, React Testing Library, and component testing strategies

### Backend Testing  
- **[Backend Testing](./backend-testing)** - pytest, database testing, and API testing patterns

### End-to-End Testing
- **[E2E Testing](./e2e-testing)** - Playwright testing for complete user workflows

### CI/CD Integration
- **[CI/CD](./ci-cd)** - Continuous integration, automated testing, and deployment pipelines

## Testing Tools & Frameworks

### Frontend
- **Jest**: JavaScript testing framework for unit and integration tests
- **React Testing Library**: Component testing utilities focused on user behavior
- **Playwright**: Modern end-to-end testing for web applications
- **Storybook**: Component development and visual testing environment

### Backend
- **pytest**: Python testing framework with powerful fixtures and plugins
- **SQLAlchemy Test Utilities**: Database testing and transaction management
- **Flask Test Client**: API endpoint testing and request simulation

## Best Practices

### Writing Effective Tests
1. **Test Behavior, Not Implementation**: Focus on what the code should do, not how it does it
2. **Keep Tests Independent**: Each test should be able to run in isolation
3. **Use Descriptive Names**: Test names should clearly describe what is being tested
4. **Arrange, Act, Assert**: Structure tests with clear setup, execution, and verification phases

### Test Organization
- **Colocation**: Place test files near the code they test
- **Naming Conventions**: Use consistent naming patterns for test files and functions
- **Test Categories**: Organize tests by type (unit, integration, e2e)
- **Test Data Management**: Use factories and fixtures for consistent test data

## Running Tests

### Quick Commands
```bash
# Frontend unit tests
npm run test

# Backend unit tests  
pytest tests/unit_tests/

# End-to-end tests
npm run playwright:test

# All tests with coverage
npm run test:coverage
```

### Targeted Test Commands

When you change a single module, prefer running the tests that cover that
module instead of the full suite. The patterns below are the fastest feedback
loop for the common case.

#### Backend (pytest)

Tests for `superset/<module>.py` typically live at
`tests/unit_tests/<module>_test.py` (or `tests/unit_tests/<sub_pkg>/test_<module>.py`
for db engine specs and similar). Run only that file from the repo root:

```bash
# Run the unit tests for a single backend module
pytest tests/unit_tests/db_engine_specs/test_postgres.py

# Narrow further to a single test function
pytest tests/unit_tests/db_engine_specs/test_postgres.py::test_epoch_to_dttm

# Re-run only the tests that failed last time, with short tracebacks
pytest tests/unit_tests/db_engine_specs/test_postgres.py --lf --tb=short
```

The `pytest.ini` at the repo root configures discovery, so these commands work
from anywhere in the repo without extra flags.

#### Frontend (jest)

Frontend tests sit beside the file they cover as `*.test.ts(x)` and run with
Jest via `npm run test`. Pass a path or pattern after `--` to scope the run:

```bash
# From superset-frontend/, run a single component's tests
cd superset-frontend
npm run test -- src/dashboard/containers/DashboardPage.test.tsx

# Match every test file under a directory
npm run test -- src/dashboard/components/SliceHeader

# Filter by test name within the matched files
npm run test -- src/dashboard --testNamePattern="renders"
```

Use `npm run test-loud` instead of `npm run test` if you need Jest's full
console output (including `console.log` / warnings) while iterating.

### Test Development Workflow
1. **Write Failing Test**: Start with a test that describes the desired behavior
2. **Implement Feature**: Write the minimum code to make the test pass
3. **Refactor**: Improve code quality while keeping tests green
4. **Verify Coverage**: Ensure adequate test coverage for new code

## Testing in Development

### Test-Driven Development (TDD)
- Write tests before implementation
- Use tests to guide design decisions
- Maintain fast feedback loops

### Continuous Testing
- Run tests automatically on code changes
- Integrate testing into development workflow
- Use pre-commit hooks for test validation

## Getting Started

1. **Set up Testing Environment**: Follow the development setup guide
2. **Run Existing Tests**: Familiarize yourself with the test suite
3. **Write Your First Test**: Start with a simple unit test
4. **Learn Testing Patterns**: Study existing tests for patterns and conventions

## Topics to be covered:

- Testing strategy and pyramid
- Test-driven development (TDD) for plugins
- Continuous integration and automated testing
- Code coverage and quality metrics
- Testing tools and frameworks overview
- Mock data and test fixtures
- Performance testing and benchmarking
- Accessibility testing automation
- Cross-browser and device testing
- Regression testing strategies

## Testing Levels

### Unit Testing
- **Component testing** - Individual React components
- **Function testing** - Data transformation and utility functions
- **Hook testing** - Custom React hooks
- **Service testing** - API clients and business logic

### Integration Testing
- **API integration** - Backend service communication
- **Component integration** - Multi-component workflows
- **Data flow testing** - End-to-end data processing
- **Plugin lifecycle testing** - Installation and activation

### End-to-End Testing
- **User workflow testing** - Complete user journeys
- **Cross-browser testing** - Browser compatibility
- **Performance testing** - Load and stress testing
- **Accessibility testing** - Screen reader and keyboard navigation

## Testing Tools

- **Jest** - Unit and integration testing framework
- **React Testing Library** - Component testing utilities
- **Playwright** - End-to-end testing (replacing Cypress)
- **Storybook** - Component development and testing

---

*This documentation is under active development. Check back soon for updates!*
