from gpt.gpt_service import generate_sql_query


def test_generate_sql_query():
    user_input = input("Enter a query description: ")
    response = generate_sql_query(user_input)
    print(f"Generated SQL Query: {response}")


if __name__ == "__main__":
    test_generate_sql_query()

