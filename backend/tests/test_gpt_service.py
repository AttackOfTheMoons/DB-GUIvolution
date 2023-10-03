from backend.gpt.gpt_service import generate_sql_query, get_database_schema
from backend.database import get_db, get_engine, get_inspector

def test_generate_sql_query(monkeypatch):
    monkeypatch.setattr('builtins.input', lambda _: 'Who are the employees under 30 years old earning less than 50000 but have been with the company for more than 5 years?')

    user_input = input("Enter a query description: ")
    response = generate_sql_query(user_input)
    print(f"Generated SQL Query: {response}")


def test_get_database_schema():
    inspector = get_inspector()
    schema_string = get_database_schema(inspector)
    print(f"Database Schema String: {schema_string}")


if __name__ == "__main__":
    test_generate_sql_query()
    test_get_database_schema()
