from typing import Any, Dict, List

from sqlalchemy import text
from sqlalchemy.exc import OperationalError

from database import get_engine, get_inspector
from gpt import generate_sql_query, get_database_schema

engine = get_engine()


def execute_and_compare(query: str, expected_query: str) -> bool:
    query = query.replace("\n", " ")
    expected_query = expected_query.replace("\n", " ")
    try:
        with engine.connect() as connection:
            # Start a transaction to roll back changes later
            trans = connection.begin()

            # If it's a SELECT query
            if query.strip().lower().startswith("select"):
                result = connection.execute(text(query)).fetchall()
                expected_result = connection.execute(text(expected_query)).fetchall()
                # Rollback the transaction (undo changes)
                trans.rollback()
                return result == expected_result

            # If it's a DML or DDL query
            else:
                # Compare the query strings directly
                # Rollback the transaction (undo any potential changes)
                trans.rollback()
                return query.strip().lower() == expected_query.strip().lower()

            # trans.rollback()
            # return query.strip().lower() == expected_query.strip().lower()

    except OperationalError:
        return False


# @pytest.mark.parametrize("user_input,expected_output", [
#     # Basic examples with descriptions of the database structure
#     ("Table 'employees' has columns: id, first_name, last_name. Show all employees",
#     "SELECT * FROM employees;"),
#     ("Table 'products' has columns: id, name, price, category_id. Get names of all products",
#     "SELECT name FROM products;"),
#     ("Table 'categories' has columns: id, category_name. Display categories", "SELECT * FROM categories;"),
#     ("Table 'orders' has columns: id, product_id, quantity. List all orders", "SELECT * FROM orders;"),
#     ("Table 'customers' has columns: id, first_name, last_name, email. Show customer details",
#     "SELECT * FROM customers;"),

#     # Edge cases with descriptions of the database structure
#     ("Table 'products' has columns: id, name, price, category_id. Show products where price is between 100 and 200",
#     "SELECT * FROM products WHERE price BETWEEN 100 AND 200;"),
#     ("Table 'employees' has columns: id, first_name, last_name, join_date. "
#     "List employees joining before 2020 and after 2018",
#     "SELECT * FROM employees WHERE join_date BETWEEN '2018-01-01' AND '2019-12-31';"),
#     ("Table 'customers' has columns: id, first_name, last_name, email. "
#     "Show customers with email ending with @gmail.com",
#     "SELECT * FROM customers WHERE email LIKE '%@gmail.com';"),

#     # Examples that should return an empty string (or other error response)
#     ('What is the meaning of life?', ""),
#     ('Tell me a joke.', "")
# ])

# def py_test_generate_sql_query(user_input, expected_output):
#     response = generate_sql_query(user_input)
#     assert response == expected_output, f"For input: {user_input}, expected: {expected_output} but got: {response}"


# Define test cases
TEST_CASES: List[Dict[str, Any]] = [
    {  # SELECT (DML)
        "input": "List all employees' names in the Engineering department.",
        "expected_output": {
            "MySQL": "SELECT first_name, last_name FROM employees INNER JOIN departments ON "
            "employees.department_id = departments.department_id WHERE departments.name = 'Engineering';",
            "PostgreSQL": "SELECT first_name, last_name FROM employees INNER JOIN departments "
            "ON employees.department_id = departments.department_id WHERE departments.name = 'Engineering';",
            "SQLite": "SELECT first_name, last_name FROM employees INNER JOIN departments ON "
            "employees.department_id = departments.department_id WHERE departments.name = 'Engineering';",
            "MSSQL": "SELECT first_name, last_name FROM employees INNER JOIN departments ON "
            "employees.department_id = departments.department_id WHERE departments.name = 'Engineering';",
            "Oracle": "SELECT first_name, last_name FROM employees INNER JOIN departments ON "
            "employees.department_id = departments.department_id WHERE departments.name = 'Engineering';",
        },
    },
    {  # INSERT (DML)
        "input": "Add a new department named Sales on Floor 4.",
        "expected_output": {
            "MySQL": "INSERT INTO departments (name, location) VALUES ('Sales', 'Floor 4');",
            "PostgreSQL": "INSERT INTO departments (name, location) VALUES ('Sales', 'Floor 4');",
            "SQLite": "INSERT INTO departments (name, location) VALUES ('Sales', 'Floor 4');",
            "MSSQL": "INSERT INTO departments (name, location) VALUES ('Sales', 'Floor 4');",
            "Oracle": "INSERT INTO departments (name, location) VALUES ('Sales', 'Floor 4');",
        },
    },
    {  # DDL
        "input": "Add an email column to the employees table.",
        "expected_output": {
            "MySQL": "ALTER TABLE employees ADD COLUMN email VARCHAR(255);",
            "PostgreSQL": "ALTER TABLE employees ADD COLUMN email VARCHAR(255);",
            "SQLite": "ALTER TABLE employees ADD COLUMN email VARCHAR(255);",
            "MSSQL": "ALTER TABLE employees ADD email VARCHAR(255);",  # MSSQL doesnt use COLUMN after ADD
            "Oracle": "ALTER TABLE employees ADD email VARCHAR2(255 CHAR);",  # Oracle uses VARCHAR2 instead of VARCHAR
        },
    },
    {  # SELECT (DML)
        "input": "Show full names and department names of employees whose department "
        "location is 'San Francisco'",
        "expected_output": {
            "MySQL": "SELECT employees.first_name, employees.last_name, departments.name FROM "
            "employees INNER JOIN departments ON employees.department_id = departments.department_id "
            "WHERE departments.location = 'San Francisco';",
            "PostgreSQL": "SELECT employees.first_name, employees.last_name, departments.name FROM "
            "employees INNER JOIN departments ON employees.department_id = departments.department_id "
            "WHERE departments.location = 'San Francisco';",
            "SQLite": "SELECT employees.first_name, employees.last_name, departments.name FROM "
            "employees INNER JOIN departments ON employees.department_id = departments.department_id "
            "WHERE departments.location = 'San Francisco';",
            "MSSQL": "SELECT employees.first_name, employees.last_name, departments.name FROM "
            "employees INNER JOIN departments ON employees.department_id = departments.department_id "
            "WHERE departments.location = 'San Francisco';",
            "Oracle": "SELECT employees.first_name, employees.last_name, departments.name FROM "
            "employees INNER JOIN departments ON employees.department_id = departments.department_id "
            "WHERE departments.location = 'San Francisco';",
        },
    },
    # { # LIMIT/OFFSET (DML)},
    # { # DATE FUNCTIONS (DML)}
]


def test_generate_sql_query() -> None:
    inspector_instance = get_inspector()
    case_select = 0  # choose which test case you want to run
    flavors = ["MySQL", "PostgreSQL", "SQLite", "MSSQL", "Oracle"]
    flavor_select = flavors[1]
    user_input = TEST_CASES[case_select]["input"]
    expected_output = TEST_CASES[case_select]["expected_output"][flavor_select]

    history = [
        {"role": "assistant", "content": "Hello, I'm your SQL query assistant!"},
        {"role": "user", "content": "hello"},
    ]

    response = generate_sql_query(
        user_input,
        flavor=flavor_select,
        inspector=inspector_instance,
        conversation_history=history,
    )

    engineered_input = response.engineered_input
    generated_sql = response.sql_query

    print(f"Engineered Input: {engineered_input}")
    print(f"Generated SQL: {generated_sql}")

    is_valid = execute_and_compare(generated_sql, expected_output)

    assert (
        is_valid
    ), f"For input: {user_input}, execution result was not as expected for {flavor_select} flavor."


def test_get_database_schema() -> None:
    inspector = get_inspector()
    schema_string = get_database_schema(inspector)
    print(f"\n\nDatabase Schema String: {schema_string}")


if __name__ == "__main__":
    test_generate_sql_query()
    test_get_database_schema()
