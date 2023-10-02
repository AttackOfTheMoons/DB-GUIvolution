from backend.gpt.gpt_service import generate_sql_query

def test_generate_sql_query(monkeypatch):
    monkeypatch.setattr('builtins.input', lambda _: 'Who are the employees under 30 years old earning less than 50000 but have been with the company for more than 5 years?')

    user_input = input("Enter a query description: ")
    response = generate_sql_query(user_input)
    print(f"Generated SQL Query: {response}")

if __name__ == "__main__":
    test_generate_sql_query()
