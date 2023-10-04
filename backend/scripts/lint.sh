#!/usr/bin/env bash

set -x

mypy --config-file ./backend/pyproject.toml ./backend
black backend --check
isort --check-only backend
ruff check backend --line-length 120 --no-fix