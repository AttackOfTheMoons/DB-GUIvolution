import openai
from backend.core import env

GPT_API_KEY = env.get("GPT_API_KEY")

if GPT_API_KEY is None:
    raise EnvironmentError("Missing environment variable: GPT_API_KEY")

openai.api_key = GPT_API_KEY

def generate_sql_query(user_input: str) -> str:
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": "Your job is to generate SQL queries that fit the description given by the user. Your response should only be the query string. If the user input is anything besides a query description, then return an empty string."},
            {"role": "assistant", "content": "Understood"},
            {"role": "user", "content": "Show me all the products in our inventory."},
            {"role": "assistant", "content": "SELECT * FROM inventory;"},
            {"role": "user", "content": "I want to see the names of products and their respective categories."},
            {"role": "assistant", "content": "SELECT product_name, category_name FROM products INNER JOIN categories ON products.category_id = categories.id;"},
            {"role": "user", "content": user_input }
        ]
    )

    return response.choices[0].message['content']