FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir poetry
RUN poetry config virtualenvs.create false

COPY poetry.lock pyproject.toml ./

RUN poetry install --no-dev

#COPY . .

EXPOSE 8000

RUN ./backend/scripts/lint.sh

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
