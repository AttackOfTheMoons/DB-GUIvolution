#!/usr/bin/env bash

set -e

mypy --config-file ./backend/pyproject.toml ./backend
mypy_exit_code=$?

black backend --config ./backend/pyproject.toml --check
black_exit_code=$?

isort backend --settings-path ./backend/pyproject.toml --check-only
isort_exit_code=$?

ruff check backend --config ./backend/pyproject.toml
ruff_exit_code=$?

if [ $mypy_exit_code -ne 0 ] || [ $black_exit_code -ne 0 ] || [ $isort_exit_code -ne 0 ] || [ $ruff_exit_code -ne 0 ]; then
  exit 1
fi

exit 0
