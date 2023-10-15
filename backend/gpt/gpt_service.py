from typing import Any, Dict, List

import openai
from sqlalchemy import Inspector

from core import env

from .flavor_queries import (
    COMMON_EXAMPLES,
    MSSQL_EXAMPLES,
    MYSQL_EXAMPLES,
    ORACLE_EXAMPLES,
    POSTGRES_EXAMPLES,
    SQLITE_EXAMPLES,
)

GPT_API_KEY = env.get("GPT_API_KEY")

if GPT_API_KEY is None:
    raise EnvironmentError("Missing environment variable: GPT_API_KEY")

openai.api_key = GPT_API_KEY


def fetch_tables(inspector: Inspector) -> List[str]:
    return inspector.get_table_names()


def fetch_columns(table_name: str, inspector: Inspector) -> List[Dict[str, Any]]:
    return [
        {
            "name": col["name"],
            "type": col["type"].__visit_name__,
            "nullable": col["nullable"],
        }
        for col in inspector.get_columns(table_name)
    ]


def generate_sql_query(user_input: str, flavor: str, inspector: Inspector) -> str:
    flavor_examples = {
        "MySQL": MYSQL_EXAMPLES,
        "PostgreSQL": POSTGRES_EXAMPLES,
        "SQLite": SQLITE_EXAMPLES,
        "MSSQL": MSSQL_EXAMPLES,
        "Oracle": ORACLE_EXAMPLES,
    }

    if flavor not in flavor_examples:
        raise ValueError(f"Unsupported SQL flavor: {flavor}")

    # Fetch the database schema
    schema_description = get_database_schema(inspector)

    # Construct the api_input
    api_input = f"[{flavor}] {schema_description} {user_input}"

    messages = (
        COMMON_EXAMPLES
        + flavor_examples[flavor]
        + [{"role": "user", "content": api_input}]
    )

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
    )

    return response.choices[0].message["content"]


def get_database_schema(inspector: Inspector) -> str:
    # Fetch all table names
    tables = fetch_tables(inspector)

    schema_description = []

    # Fetch columns for each table
    for table in tables:
        columns = fetch_columns(table, inspector)
        column_names = [col["name"] for col in columns]
        schema_description.append(
            f"Table '{table}' has columns: {', '.join(column_names)}."
        )

    return " ".join(schema_description)
