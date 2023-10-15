-- Populate departments table
INSERT INTO departments (name, location) VALUES
    ('Human Resources', 'Floor 1'),
    ('Engineering', 'Floor 2'),
    ('Finance', 'Floor 3');

-- Populate employees table
INSERT INTO employees (first_name, last_name, department_id, hire_date) VALUES
    ('John', 'Doe', 1, '2022-01-15'),
    ('Alice', 'Smith', 2, '2021-05-22'),
    ('Bob', 'Johnson', 3, '2020-08-30'),
    ('Charlie', 'Brown', 2, '2019-11-10');

-- Populate projects table
INSERT INTO projects (project_name, start_date, end_date, manager_id) VALUES
    ('Project A', '2022-01-01', '2022-12-31', 2),
    ('Project B', '2023-01-01', '2023-12-31', 4);
    