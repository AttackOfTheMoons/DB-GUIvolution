from database import get_inspector
from gpt import generate_sql_query, get_database_schema

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


# Define a single test case
TEST_CASE = {
    # 'input': "Show all employees",
    # 'expected_output': "SELECT * FROM employees;"
    "input": "Show employees and their department names where department location is 'San Francisco'",
    "expected_output": "SELECT employees.first_name, employees.last_name, departments.name AS department_name "
                        "FROM employees "
                        "JOIN departments ON employees.department_id = departments.id "
                        "WHERE departments.location = 'San Francisco';"
    # 'input': "What is the meaning of life?",
    # 'expected_output': ""
}


def test_generate_sql_query() -> None:
    user_input = TEST_CASE["input"]
    expected_output = TEST_CASE["expected_output"]

    inspector_instance = get_inspector()

    response = generate_sql_query(
        user_input, flavor="MySQL", inspector=inspector_instance
    )

    assert (
        response == expected_output
    ), f"For input: {user_input}, expected: {expected_output} but got: {response}"

    print(f"output: {response}")


def test_get_database_schema() -> None:
    inspector = get_inspector()
    schema_string = get_database_schema(inspector)
    print(f"Database Schema String: {schema_string}")


if __name__ == "__main__":
    test_generate_sql_query()
    test_get_database_schema()
