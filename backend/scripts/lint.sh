#!/usr/bin/env bash

set -x

mypy backend
black backend --check
isort --check-only backend
flake8 backend --max-line-length 120 --exclude .git,__pycache__,__init__.py,.mypy_cache,.pytest_cache