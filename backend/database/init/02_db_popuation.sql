-- Populate departments table
INSERT INTO departments (name, location) VALUES
    ('Human Resources', 'Floor 1'),
    ('Engineering', 'Floor 2'),
    ('Finance', 'Floor 3');

-- Populate employees table with hard-coded test data for 30 employees
INSERT INTO employees (first_name, last_name, department_id, hire_date) VALUES
    ('John', 'Doe', 1, '2020-01-15'),
    ('Alice', 'Smith', 2, '2019-05-22'),
    ('Bob', 'Johnson', 3, '2018-08-30'),
    ('Charlie', 'Brown', 2, '2017-11-10'),
    ('Eve', 'White', 1, '2016-03-25'),
    ('Frank', 'Black', 3, '2021-02-11'),
    ('Grace', 'Davis', 2, '2015-04-07'),
    ('Hannah', 'Martin', 1, '2014-06-19'),
    ('Ivan', 'Garcia', 3, '2013-09-23'),
    ('Julie', 'Rodriguez', 2, '2012-12-05'),
    ('Kyle', 'Martinez', 1, '2011-01-17'),
    ('Lucia', 'Hernandez', 2, '2010-03-31'),
    ('Mason', 'Lopez', 3, '2018-05-13'),
    ('Nina', 'Gonzalez', 1, '2019-07-28'),
    ('Oliver', 'Perez', 2, '2020-10-08'),
    ('Penny', 'Wilson', 3, '2017-04-21'),
    ('Quinn', 'Anderson', 2, '2015-12-03'),
    ('Rachel', 'Thomas', 1, '2021-07-16'),
    ('Steve', 'Taylor', 3, '2016-08-27'),
    ('Tina', 'Lee', 2, '2014-10-09'),
    ('Ulysses', 'Harris', 1, '2013-11-20'),
    ('Victoria', 'Clark', 2, '2012-02-01'),
    ('Walter', 'Lewis', 3, '2017-03-14'),
    ('Xena', 'Walker', 2, '2020-05-26'),
    ('Yara', 'Hall', 1, '2019-08-06'),
    ('Zane', 'Allen', 3, '2018-09-17'),
    ('Aria', 'Young', 2, '2016-12-29'),
    ('Brian', 'Hernandez', 1, '2021-04-10'),
    ('Catherine', 'King', 3, '2015-06-22'),
    ('David', 'Wright', 2, '2014-08-03');

-- Populate projects table with hard-coded test data for 5 projects
INSERT INTO projects (project_name, start_date, end_date, manager_id) VALUES
    ('Project A', '2018-01-01', '2018-12-31', 1),
    ('Project B', '2019-02-01', '2019-11-30', 5),
    ('Project C', '2020-03-01', '2020-09-30', 10),
    ('Project D', '2021-04-01', '2021-10-31', 15),
    ('Project E', '2022-05-01', '2022-12-31', 20);
