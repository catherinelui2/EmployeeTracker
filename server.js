const mySQL = require("mysql");
const inquirer = require("inquirer");
// const { start } = require("repl");
// const { fstat } = require("fs");

//create connections to sql database
let connection = mySQL.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "rootpw",
    database: "orgChart_db"
});

//connect to mySQL server and SQLDB
connection.connect( (err) => {
    if (err) throw err;
    //run the start function after the connection is made to start prompting questions
    start();
});


//function which prompts the users 
let start = () => {
    inquirer. prompt({
        type: "list",
        message: "What would you like to do?",
        name: "actions",
        choices: ["View All Employees", "View All Employees By Department", "View All Employees by Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "Exit"]
    })
    .then((answers) => {
        switch (answers.actions) {
            case "View All Employees":
                viewAllEmployees();
                break;

            case "View All Employees By Department":
                viewAllEmployeesByDept();
                break;

            case "View All Employees by Manager":
                viewAllEmployeesByMgr();
                break;

            case "Add Employee":
                addEmployee();
                break;

            case "Remove Employee":
                removeEmployee();
                break;

            case "Update Employee Role":
                updateEmployeeRole();
                break; 

            case "Update Employee Manager":
                updateEmployeeMgr();
                break;
            case "Exit":
                console.log("Thank you for using this App!");
                connection.end();
        }
    })
}


//View all Employees
const viewAllEmployees = () => {
    console.log("running?");
    let query = "SELECT employee.first_name, employee.last_name, role.title, department.name AS Department, role.salary, CONCAT(manager.mgr_first, manager.mgr_last) AS Manager ";
    query += "FROM department INNER JOIN role ON role.department_id = department.id ";
    
    query += "INNER JOIN employee ON employee.role_id = role.id ";
    query += "LEFT JOIN manager ON manager.id = employee.manager_id ";

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("----------------------------------");
        console.table(res);
    })
    
    console.log("What would you like to do next?");
    start();
}

// allow users to add dept, role, employees
//view dept, roles, employees
// update employees roles

//bonus update employee manager
//view employees by manager
//delete department, roles, employees
// view total utilized budget of a department (combined salaries of all employees in the dept)
