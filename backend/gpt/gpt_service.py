import openai
from api.database_endpoint import get_columns, get_table
from core import env
from database import get_inspector
from fastapi import Depends
from sqlalchemy.dialects.postgresql.base import PGInspector

GPT_API_KEY = env.get("GPT_API_KEY")

if GPT_API_KEY is None:
    raise EnvironmentError("Missing environment variable: GPT_API_KEY")

openai.api_key = GPT_API_KEY


def generate_sql_query(user_input: str) -> str:
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "user",
                "content": "Your job is to generate SQL queries based on the provided database schema and user's query description. Your response should only be the query string. If the user input is anything besides a query description, then return an empty string.",
            },
            {"role": "assistant", "content": "Understood"},
            {
                "role": "user",
                "content": "Table 'inventory' has columns: id, product_name, quantity. Show me all the products in our inventory.",
            },
            {"role": "assistant", "content": "SELECT * FROM inventory;"},
            {
                "role": "user",
                "content": "Table 'products' has columns: id, product_name, category_id. Table 'categories' has columns: id, category_name. I want to see the names of products and their respective categories.",
            },
            {
                "role": "assistant",
                "content": "SELECT product_name, category_name FROM products INNER JOIN categories ON products.category_id = categories.id;",
            },
            {"role": "user", "content": user_input},
        ],
    )

    return response.choices[0].message["content"]


def get_database_schema(inspector: PGInspector = Depends(get_inspector)) -> str:
    # Fetch all table names
    tables = get_table(inspector)

    schema_description = []

    # Fetch columns for each table
    for table in tables:
        columns = get_columns(table, inspector)
        column_names = [col["name"] for col in columns]
        schema_description.append(
            f"Table '{table}' has columns: {', '.join(column_names)}."
        )

    return " ".join(schema_description)
