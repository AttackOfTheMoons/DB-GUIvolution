COMMON_EXAMPLES = [
    {
        "role": "user",
        "content": "Your job is to generate SQL queries for the specified flavor based on the provided database "
                   "schema and user's query description. Your response should only be the query string. Do not use aliases in the query."
                   "If the user input is anything besides a query description, then return an empty string.",
    },
    {"role": "assistant", "content": "Understood"},
    {
        "role": "user",
        "content": "Table 'inventory' has columns: id (INT), product_name (VARCHAR), quantity (INT). "
                   "Show me all the products in our inventory.",
    },
    {"role": "assistant", "content": "SELECT * FROM inventory;"},
    {
        "role": "user",
        "content": "Table 'products' has columns: id (INT), product_name (VARCHAR), category_id (INT). "
                   "Table 'categories' has columns: id (INT), category_name (VARCHAR). I want to see the names of"
                   " products and their respective categories.",
    },
    {
        "role": "assistant",
        "content": "SELECT product_name, category_name FROM products "
                   "INNER JOIN categories ON products.category_id = categories.id;",
    },
    {
        "role": "user",
        "content": "Table 'employees' has columns: id (INT), first_name (VARCHAR), last_name (VARCHAR), department (VARCHAR). "
                   "Find the first name of all employees in the 'IT' department.",
    },
    {
        "role": "assistant",
        "content": "SELECT first_name FROM employees WHERE department = 'IT';",
    },
    {
        "role": "user",
        "content": "Table 'orders' has columns: id (INT), product_name (VARCHAR), date (DATE), price (DECIMAL). "
                   "Get the sum of all orders' prices.",
    },
    {
        "role": "assistant",
        "content": "SELECT SUM(price) FROM orders;",
    },
]

MYSQL_EXAMPLES = [
    {
        "role": "user",
        "content": "[MySQL] Table 'members' has columns: id (INT), name (VARCHAR), age (INT), membership_date (DATE). "
                   "Add a username column with a maximum length of 255 characters to the 'members' table."
    },
    {
        "role": "assistant",
        "content": "ALTER TABLE members ADD COLUMN username VARCHAR(255);",
    },
]

POSTGRES_EXAMPLES = [
    {
        "role": "user",
        "content": "[PostgreSQL] Table 'students' has columns: id (INT), name (VARCHAR), dob (DATE), enrollment_date (DATE). "
        "Find all students enrolled in the last 30 days.",
    },
    {
        "role": "assistant",
        "content": "SELECT name FROM students WHERE enrollment_date > NOW() - INTERVAL '30 days';",
    },
    {
        "role": "user",
        "content": "[PostgreSQL] Table 'members' has columns: id (INT), name (VARCHAR), age (INT), membership_date (DATE). "
                   "Add a username column with a maximum length of 255 characters to the 'members' table.",
    },
    {
        "role": "assistant",
        "content": "ALTER TABLE members ADD COLUMN username VARCHAR(255);",
    },
]

SQLITE_EXAMPLES = [
    {
        "role": "user",
        "content": "[SQLite] Table 'members' has columns: id (INT), name (VARCHAR), age (INT), membership_date (DATE). "
                   "Add a username column with a maximum length of 255 characters to the 'members' table.",
    },
    {
        "role": "assistant",
        "content": "ALTER TABLE members ADD COLUMN username VARCHAR(255);",
    },
]

MSSQL_EXAMPLES = [
    {
        "role": "user",
        "content": "[MSSQL] Table 'members' has columns: id (INT), name (VARCHAR), age (INT), membership_date (DATE). "
                   "Add a username column with a maximum length of 255 characters to the 'members' table.",
    },
    {
        "role": "assistant",
        "content": "ALTER TABLE members ADD username VARCHAR(255);",
    },
]

ORACLE_EXAMPLES = [
    {
        "role": "user",
        "content": "[Oracle] Table 'members' has columns: id (INT), name (VARCHAR2), age (INT), membership_date (DATE). "
                   "Add a username column with a maximum length of 255 characters to the 'members' table.",
    },
    {
        "role": "assistant",
        "content": "ALTER TABLE members ADD username VARCHAR2(255 CHAR);",
    },
]



FLAVOR_EXAMPLES = {
    "common": COMMON_EXAMPLES,
    "mysql": MYSQL_EXAMPLES,
    "postgres": POSTGRES_EXAMPLES,
    "sqlite": SQLITE_EXAMPLES,
    "mssql": MSSQL_EXAMPLES,
    "oracle": ORACLE_EXAMPLES,
}
