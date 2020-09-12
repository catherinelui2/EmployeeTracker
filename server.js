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
    let query = "SELECT employee.first_name, employee.last_name, role.title, department.name AS Department, role.salary, CONCAT(manager.mgr_first, manager.mgr_last) AS Manager ";
    query += "FROM department INNER JOIN role ON role.department_id = department.id ";
    
    query += "INNER JOIN employee ON employee.role_id = role.id ";
    query += "LEFT JOIN manager ON manager.id = employee.manager_id ";

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("----------------------------------");
        console.table(res);
        console.log("What would you like to do next?");
        start();
    })
}

//view all employees by dept
const viewAllEmployeesByDept = () => {
    let query = "SELECT department.name AS Department, employee.first_name, employee.last_name, role.title, role.salary, CONCAT(manager.mgr_first, manager.mgr_last) AS Manager ";
    query += "FROM department INNER JOIN role ON role.department_id = department.id ";
    
    query += "INNER JOIN employee ON employee.role_id = role.id ";
    query += "LEFT JOIN manager ON manager.id = employee.manager_id ";
    query += "ORDER BY department.name ASC";

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("----------------------------------");
        console.table(res);
        console.log("----------------------------------");
        start();
    })
}

//view all employees by mgr
const viewAllEmployeesByMgr = () => {
    let query = "SELECT CONCAT(manager.mgr_first, manager.mgr_last) AS Manager, department.name AS Department, employee.first_name, employee.last_name, role.title, role.salary ";
    query += "FROM department INNER JOIN role ON role.department_id = department.id ";
    
    query += "INNER JOIN employee ON employee.role_id = role.id ";
    query += "INNER JOIN manager ON manager.id = employee.manager_id ";
    query += "ORDER BY manager.mgr_first ASC";

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("----------------------------------");
        console.table(res);
        console.log("----------------------------------");
        start();
    })
}

// add employee
const addEmployee = () => {
    let query = "SELECT employee.first_name, employee.last_name, role.title, department.name AS Department, role.salary, CONCAT(manager.mgr_first, manager.mgr_last) AS Manager ";
        query += "FROM department INNER JOIN role ON role.department_id = department.id ";
        query += "INNER JOIN employee ON employee.role_id = role.id ";
        query += "INNER JOIN manager ON manager.id = employee.manager_id ";
    
        connection.query(query, (err, results) => {
        if (err) throw err;
        inquirer
        .prompt([
        {
            name: "empFirstName",
            type: "input",
            message: "What is the employee's first name?"
        },
        {
            name: "empLastName",
            type: "input",
            message: "What is the employee's last name?"
        },
        {
            name: "empRole",
            type: "rawlist",
            message: "What this is employee's role?",
            choices: () => {
                let choiceArrary = [];
                for (var i = 0; i < results.length; i++) {
                    choiceArrary.push(results[i].title);
                }
                return choiceArrary;
            }
        },
        {
            name: "whichMgr",
            type: "rawlist",
            message: "Who is this employee's manager?",
            choices: () => {
                let choiceArrary = [];
                for (var i = 0; i < results.length; i++) {
                    choiceArrary.push(results[i].Manager);
                }
                return choiceArrary;
            }
        }
        ])
        .then( (answer) => {
            //get the id of the chosen role
            connection.query("SELECT * FROM orgChart_db.role", (err, results) => {
                let chosenRoleID;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].id === answer.role_id) {
                        chosenRoleID = results[i].id;
                    }
                }
            });
            
            connection.query("INSERT INTO employee SET ?", 
        {
            first_name: answer.empFirstName,
            last_name: answer.empLastName,
            role_id: answer.empRole.chosenRoleID,
            manager_id: answer.whichMgr.chosenID
        }, (err) => {
            if (err) throw err;
            console.log("You've added an employee successfully!");
            start();
        }
        );
        });
    });

}

// remove employee


//update employee role

//update employee mgr

// view total utilized budget of a department (combined salaries of all employees in the dept)



// allow users to add dept, role, employees
//view dept, roles, employees
// update employees roles

//bonus update employee manager
//view employees by manager
//delete department, roles, employees

