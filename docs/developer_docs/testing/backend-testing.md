---
title: Backend Testing
sidebar_position: 3
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

# Backend Testing

🚧 **Coming Soon** 🚧

Complete guide for testing Superset's Python backend, APIs, and database interactions.

## Topics to be covered:

- Pytest configuration and fixtures
- Unit testing best practices
- Integration testing with databases
- API endpoint testing
- Mocking strategies and patterns
- Testing async operations with Celery
- Security testing guidelines
- Performance and load testing
- Test database setup and teardown
- Coverage requirements

## Quick Commands

```bash
# Run all backend tests
pytest

# Run specific test file
pytest tests/unit_tests/specific_test.py

# Run with coverage
pytest --cov=superset

# Run tests in parallel
pytest -n auto

# Run only unit tests
pytest tests/unit_tests/
```

## Targeted Test Commands

When iterating on a change, run only the tests you care about to keep the
feedback loop fast. The examples below assume you are at the repo root and
have your virtual environment activated. Long-form flags are used so each
command is self-documenting; the equivalent short flag is shown in the
comment above each example.

```bash
# Run a single test file
pytest tests/unit_tests/db_engine_specs/test_postgres.py

# Run a single test function in a file
pytest tests/unit_tests/db_engine_specs/test_postgres.py::test_convert_dttm

# Run a single test method on a class
pytest tests/integration_tests/charts/api_tests.py::TestChartApi::test_info

# Filter by a Python-style name expression (short form: -k EXPRESSION)
pytest tests/unit_tests/ -k "convert_dttm and not mysql" --verbose

# Filter by a registered pytest marker (short form: -m MARKEXPR)
pytest -m "slow" --verbose

# Re-run only the tests that failed on the previous run, with full output
pytest --last-failed --verbose

# Stop after the first failure for a quick TDD loop (short form: -x)
pytest --exitfirst --verbose tests/unit_tests/db_engine_specs/

# Show print() output and detailed tracebacks while iterating
#   --capture=no        short form: -s   (do not capture stdout/stderr)
#   --verbose --verbose short form: -vv  (extra-verbose test reporting)
#   --showlocals        short form: -l   (show local variables in tracebacks)
#   --tb=long                            (use the long traceback format)
pytest --capture=no --verbose --verbose --showlocals --tb=long \
    tests/unit_tests/db_engine_specs/test_postgres.py
```

### Unit vs. Integration Tests

The Python suite is split into two top-level directories under `tests/`:

```bash
# Fast, isolated unit tests (no database required)
pytest tests/unit_tests/ --verbose

# Integration tests (require a working test environment, see CONTRIBUTING)
pytest tests/integration_tests/ --verbose
```

Integration tests require the test config and a populated metadata database.
The repo provides a helper script that wires this up for you:

```bash
# Equivalent to what CI runs for integration tests
scripts/python_tests.sh

# You can pass any extra pytest args through the script
scripts/python_tests.sh tests/integration_tests/charts/api_tests.py \
    -k test_info --verbose
```

## Testing Alerts & Reports with Celery and MailHog

The Alerts & Reports feature relies on Celery for task scheduling and execution. To test it locally, you need Redis (message broker), Celery Beat (scheduler), a Celery Worker (executor), and an SMTP server to receive email notifications.

### Prerequisites

- Redis running on `localhost:6379`
- [MailHog](https://github.com/mailhog/MailHog) installed (a local SMTP server with a web UI for viewing caught emails)

### superset_config.py

Your `CeleryConfig` **must** include `beat_schedule`. When you define a custom `CeleryConfig` class in `superset_config.py`, it replaces the default entirely. If you omit `beat_schedule`, Celery Beat will start but never schedule any report tasks.

```python
from celery.schedules import crontab
from superset.tasks.types import ExecutorType

REDIS_HOST = "localhost"
REDIS_PORT = "6379"

class CeleryConfig:
    broker_url = f"redis://{REDIS_HOST}:{REDIS_PORT}/0"
    result_backend = f"redis://{REDIS_HOST}:{REDIS_PORT}/0"
    broker_connection_retry_on_startup = True
    imports = (
        "superset.sql_lab",
        "superset.tasks.scheduler",
        "superset.tasks.thumbnails",
        "superset.tasks.cache",
    )
    worker_prefetch_multiplier = 10
    task_acks_late = True
    beat_schedule = {
        "reports.scheduler": {
            "task": "reports.scheduler",
            "schedule": crontab(minute="*", hour="*"),
        },
        "reports.prune_log": {
            "task": "reports.prune_log",
            "schedule": crontab(minute=0, hour=0),
        },
    }

CELERY_CONFIG = CeleryConfig

# SMTP settings pointing to MailHog
SMTP_HOST = "localhost"
SMTP_PORT = 1025
SMTP_STARTTLS = False
SMTP_SSL = False
SMTP_USER = ""
SMTP_PASSWORD = ""
SMTP_MAIL_FROM = "superset@localhost"

# Must match where your frontend is running
WEBDRIVER_BASEURL = "http://localhost:9000/"

ALERT_REPORTS_EXECUTE_AS = [ExecutorType.OWNER]

FEATURE_FLAGS = {
    "ALERT_REPORTS": True,
    # Recommended for better screenshot support (WebGL/DeckGL charts)
    "PLAYWRIGHT_REPORTS_AND_THUMBNAILS": True,
}
```

:::note
Do not include `"superset.tasks.async_queries"` in `CeleryConfig.imports` unless you need Global Async Queries. That module accesses `current_app.config` at import time and will crash the worker with a "Working outside of application context" error.
:::

### Starting the Services

Start MailHog, then Celery Beat and Worker in separate terminals:

```bash
# Terminal 1 - MailHog (SMTP on :1025, Web UI on :8025)
MailHog

# Terminal 2 - Celery Beat (scheduler)
celery --app=superset.tasks.celery_app:app beat --loglevel=info

# Terminal 3 - Celery Worker (executor)
celery --app=superset.tasks.celery_app:app worker --concurrency=1 --loglevel=info
```

Use `--concurrency=1` to limit resource usage on your dev machine.

### Verifying the Setup

1. **Beat** should log `Scheduler: Sending due task reports.scheduler (reports.scheduler)` once per minute
2. **Worker** should log `Scheduling alert <name> eta: <timestamp>` for each active report
3. Create a test report in **Settings > Alerts & Reports** with a `* * * * *` cron schedule
4. Check **http://localhost:8025** (MailHog web UI) for the email within 1-2 minutes

### Troubleshooting

| Problem | Solution |
|---|---|
| Beat shows no output | Ensure `beat_schedule` is defined in your `CeleryConfig` and `--loglevel=info` is set |
| "Report Schedule is still working, refusing to re-compute" | Previous executions are stuck. Reset with: `UPDATE report_schedule SET last_state = 'Not triggered' WHERE id = <id>;` |
| Task backlog overwhelming the worker | Flush Redis: `redis-cli FLUSHDB`, then restart Beat and Worker |
| Screenshot timeout | Ensure your frontend dev server is running and `WEBDRIVER_BASEURL` matches its URL |

---

*This documentation is under active development. Check back soon for updates!*
