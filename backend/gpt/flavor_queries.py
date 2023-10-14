COMMON_EXAMPLES = [
    {
        "role": "user",
        "content": "Your job is to generate SQL queries for the specified flavor based on the provided database "
        "schema and user's query description. Your response should only be the query string. "
        "If the user input is anything besides a query description, then return an empty string.",
    },
    {"role": "assistant", "content": "Understood"},
    {
        "role": "user",
        "content": "Table 'inventory' has columns: id, product_name, quantity. "
        "Show me all the products in our inventory.",
    },
    {"role": "assistant", "content": "SELECT * FROM inventory;"},
    {
        "role": "user",
        "content": "Table 'products' has columns: id, product_name, category_id. "
        "Table 'categories' has columns: id, category_name. I want to see the names of"
        " products and their respective categories.",
    },
    {
        "role": "assistant",
        "content": "SELECT product_name, category_name FROM products "
        "INNER JOIN categories ON products.category_id = categories.id;",
    },
]

MYSQL_EXAMPLES = [
    {
        "role": "user",
        "content": "[MySQL] Table 'employees' has columns: id, first_name, last_name, department. "
        "Find the first name of all employees in the 'IT' department.",
    },
    {
        "role": "assistant",
        "content": "SELECT first_name FROM employees WHERE department = 'IT';",
    },
    {
        "role": "user",
        "content": "[MySQL] Table 'orders' has columns: id, product_name, date, price. "
        "Get the sum of all orders' prices.",
    },
    {"role": "assistant", "content": "SELECT SUM(price) FROM orders;"},
]

POSTGRES_EXAMPLES = [
    {
        "role": "user",
        "content": "[PostgreSQL] Table 'students' has columns: id, name, dob, enrollment_date. "
        "Find all students enrolled in the last 30 days.",
    },
    {
        "role": "assistant",
        "content": "SELECT name FROM students WHERE enrollment_date > NOW() - INTERVAL '30 days';",
    },
    {
        "role": "user",
        "content": "[PostgreSQL] Table 'transactions' has columns: id, item_name, timestamp, amount. "
        "Get the average transaction amount.",
    },
    {"role": "assistant", "content": "SELECT AVG(amount) FROM transactions;"},
]

SQLITE_EXAMPLES = [
    {
        "role": "user",
        "content": "[SQLite] Table 'books' has columns: id, title, author, published_date. "
        "Show me all the books published in 2022.",
    },
    {
        "role": "assistant",
        "content": "SELECT title FROM books WHERE strftime('%Y', published_date) = '2022';",
    },
    {
        "role": "user",
        "content": "[SQLite] Table 'visits' has columns: id, visitor_name, date_visited. "
        "Count the total number of visits.",
    },
    {"role": "assistant", "content": "SELECT COUNT(id) FROM visits;"},
]

MSSQL_EXAMPLES = [
    {
        "role": "user",
        "content": "[MSSQL] Table 'clients' has columns: id, client_name, registration_date. "
        "List all clients registered in January 2023.",
    },
    {
        "role": "assistant",
        "content": "SELECT client_name FROM clients WHERE MONTH(registration_date) = 1 "
        "AND YEAR(registration_date) = 2023;",
    },
    {
        "role": "user",
        "content": "[MSSQL] Table 'invoices' has columns: id, invoice_number, creation_date, total. "
        "Calculate the total of all invoices.",
    },
    {"role": "assistant", "content": "SELECT SUM(total) FROM invoices;"},
]

ORACLE_EXAMPLES = [
    {
        "role": "user",
        "content": "[Oracle] Table 'projects' has columns: id, project_name, start_date, end_date. "
        "Find all projects starting in February 2023.",
    },
    {
        "role": "assistant",
        "content": "SELECT project_name FROM projects WHERE EXTRACT(MONTH FROM start_date) = 2 "
        "AND EXTRACT(YEAR FROM start_date) = 2023;",
    },
    {
        "role": "user",
        "content": "[Oracle] Table 'payments' has columns: id, payee, payment_date, amount. "
        "Get the highest payment amount.",
    },
    {"role": "assistant", "content": "SELECT MAX(amount) FROM payments;"},
]


FLAVOR_EXAMPLES = {
    "common": COMMON_EXAMPLES,
    "mysql": MYSQL_EXAMPLES,
    "postgres": POSTGRES_EXAMPLES,
    "sqlite": SQLITE_EXAMPLES,
    "mssql": MSSQL_EXAMPLES,
    "oracle": ORACLE_EXAMPLES,
}
