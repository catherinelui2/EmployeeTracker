const mySQL = require("mysql");
const inquirer = require("inquirer");
const { start } = require("repl");
const { fstat } = require("fs");

//create connections to sql database
const connection = mysql.connection({
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
const start = () => {
    inquirer. prompt({
        type: "list",
        message: "What would you like to do?",
        name: "actions",
        choices: ["View All Employees", "View All Employees By Department", "View All Employees by Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "Exit"]
    })
    .then((answers) => {
        switch (answers.role) {
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
    let query = "SELECT orgChart_db.employee, orgChart_db.role, orgChart_db.department";
    query += "FROM "
}

// allow users to add dept, role, employees
//view dept, roles, employees
// update employees roles

//bonus update employee manager
//view employees by manager
//delete department, roles, employees
// view total utilized budget of a department (combined salaries of all employees in the dept)
