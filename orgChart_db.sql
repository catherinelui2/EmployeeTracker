CREATE DATABASE orgChart_db;

CREATE TABLE department (
PRIMARY KEY (id),
id INTEGER(11) NOT NULL AUTO_INCREMENT,
name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
PRIMARY KEY (id),
id INTEGER(11) NOT NULL AUTO_INCREMENT, 
title VARCHAR(30) NOT NULL,
salary DECIMAL (10,2) NOT NULL,
department_id INT NOT NUll 
);

CREATE TABLE employee (
    PRIMARY KEY (id),
    id INTEGER(11) NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NUll,
    role_id INTEGER(11) NOT NULL,
    manager_id INTEGER(11) NULL
);