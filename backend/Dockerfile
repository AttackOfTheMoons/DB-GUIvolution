FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir poetry
RUN pip install pytest
RUN pip install openai
RUN pip install python-dotenv

RUN poetry config virtualenvs.create false

COPY poetry.lock pyproject.toml ./

RUN poetry install --no-dev

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
