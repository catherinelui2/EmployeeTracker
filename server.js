const mySQL = require("mysql");
const inquirer = require("inquirer");


//create connections to sql database
let connection = mySQL.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "rootpw",
    database: "orgChart_db",
});

//connect to mySQL server and SQLDB
connection.connect((err) => {
    if (err) throw err;
    //run the start function after the connection is made to start prompting questions
    start();
});

//function which prompts the users
let start = () => {
    inquirer
        .prompt({
            type: "list",
            message: "What would you like to do?",
            name: "actions",
            choices: [
                "View All Employees",
                "View All Employees By Department",
                "View All Employees by Manager",
                "Add Employee",
                "Remove Employee",
                "Update Employee Role",
                //"Update Employee Manager",
                "Exit",
            ],
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

                //case "Update Employee Manager":
                //updateEmployeeMgr();
                //break;
                case "Exit":
                    console.log("Thank you for using this App!");
                    connection.end();
            }
        });
};

//View all Employees
const viewAllEmployees = () => {
    let query =
        "SELECT employee.first_name, employee.last_name, role.title, department.name AS Department, role.salary, CONCAT(manager.mgr_first, manager.mgr_last) AS Manager ";
    query += "FROM department INNER JOIN role ON role.department_id = department.id ";

    query += "INNER JOIN employee ON employee.role_id = role.id ";
    query += "LEFT JOIN manager ON manager.id = employee.manager_id ";

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("----------------------------------");
        console.table(res);
        console.log("What would you like to do next?");
        start();
    });
};

//view all employees by dept
const viewAllEmployeesByDept = () => {
    let query =
        "SELECT department.name AS Department, employee.first_name, employee.last_name, role.title, role.salary, CONCAT(manager.mgr_first, manager.mgr_last) AS Manager ";
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
    });
};

//view all employees by mgr
const viewAllEmployeesByMgr = () => {
    let query =
        "SELECT CONCAT(manager.mgr_first, manager.mgr_last) AS Manager, department.name AS Department, employee.first_name, employee.last_name, role.title, role.salary ";
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
    });
};

// add employee
const addEmployee = () => {
    let query =
        "SELECT employee.first_name, employee.last_name, role.title, department.name AS Department, role.salary, CONCAT(manager.mgr_first, manager.mgr_last) AS Manager ";
    query += "FROM department INNER JOIN role ON role.department_id = department.id ";
    query += "INNER JOIN employee ON employee.role_id = role.id ";
    query += "INNER JOIN manager ON manager.id = employee.manager_id ";

    connection.query(query, (err, results) => {
        if (err) throw err;

        connection.query("SELECT id, CONCAT(mgr_first, mgr_last) AS Manager FROM orgChart_db.manager", (error, resultMgr) => {
            if (error) throw error;
            inquirer
            .prompt([
                {
                    name: "empFirstName",
                    type: "input",
                    message: "What is the employee's first name?",
                },
                {
                    name: "empLastName",
                    type: "input",
                    message: "What is the employee's last name?",
                },
                {
                    name: "empRole",
                    type: "rawlist",
                    message: "What this is employee's role?",
                    choices: () => {
                        let choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].title);
                        }
                        return choiceArray;
                    }
                },
                {
                    name: "whichMgr",
                    type: "rawlist",
                    message: "Who is this employee's manager?",
                    choices: () => {
                        let choiceArray = [];

                        for (var j = 0; j < resultMgr.length; j++) {
                            choiceArray.push(resultMgr[j].Manager);
                        }
                        return choiceArray;
                    },
                },])
                .then((answer) => {
                    //get the id of the chosen role
                    connection.query("SELECT * FROM orgChart_db.role", (err, results) => {
                        if (err) throw err;
    
                        let chosenRoleID;
    
                        for (var i = 0; i < results.length; i++) {
                            //to find out which employee role was selected
                            if (results[i].title === answer.empRole) {
                                chosenRoleID = results[i].id;
                            }
                        }
    
                        connection.query(
                            "SELECT id, CONCAT(manager.mgr_first, manager.mgr_last) AS Manager FROM orgChart_db.manager; ",
                            (err, result) => {
                                if (err) throw err;
                                // to find out which manager was selected
                                let chosenMgrID;

                                for (var j = 0; j < result.length; j++) {
                                    if (result[j].Manager === answer.whichMgr) {
                                        chosenMgrID = result[j].id;
                                    }
                                }
                                connection.query(
                                    "INSERT INTO employee SET ?", // added new employee info into orgChart_db
                                    {
                                        first_name: answer.empFirstName,
                                        last_name: answer.empLastName,
                                        role_id: chosenRoleID,
                                        manager_id: chosenMgrID,
                                    },
                                    (err) => {
                                        if (err) throw err;
                                        console.log("You've added an employee successfully!");
                                        start();
                                    }
                                );
                            }
                        );
                    });
                });
        });
        }) 
};

// remove employee
const removeEmployee = () => {
    //query employee first and last name and display as Employee
    connection.query(
        "SELECT id, CONCAT(first_name, last_name) AS Employee FROM orgChart_db.employee; ",
        (err, results) => {
            if (err) throw err;

            //start prompt
            inquirer
                .prompt([
                    {
                        name: "removeEmp",
                        type: "rawlist",
                        message: "Select the employe that you would like to remove.",
                        choices: () => {
                            let choiceArray = [];
                            for (var i = 0; i < results.length; i++) {
                                choiceArray.push(results[i].Employee);
                            }
                            return choiceArray;
                        },
                    },
                ])
                .then((answer) => {
                    // get chosen employee
                    let chosenEmp;
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].Employee === answer.removeEmp) {
                            chosenEmp = results[i].id;
                            // Delete selected employee
                            connection.query(
                                "DELETE FROM employee WHERE ?",
                                {
                                    id: chosenEmp
                                },
                                (err, res) => {
                                    if (err) throw err;
                                    console.log("You have sucessfully removed " + answer.removeEmp);
                                    start();
                                }
                            );
                        }
                    }
                });
        }
    );
};

//update employee role
const updateEmployeeRole = () => {
    let query =
        "SELECT employee.id, CONCAT(employee.first_name, employee.last_name) AS Employee, employee.role_id, role.title FROM role INNER JOIN employee ON employee.role_id = role.id";

    connection.query(query, (err, results) => {

        if (err) throw err;

        connection.query("SELECT * FROM orgChart_db.role; ", (error, result) => {
            if (error) throw error;

            inquirer
                .prompt([
                    { //choices from the employee table
                        name: "employee",
                        type: "rawlist",
                        message: "Which employee would you like to update?",
                        choices: () => {
                            let choiceArray = [];
                            for (var i = 0; i < results.length; i++) {
                                const x = results[i];
                                choiceArray.push(
                                    `${x.Employee} /${x.id}`)
                                }
                            return choiceArray;
                        },
                    },
                    {// choices from the role table
                        name: "role",
                        type: "rawlist",
                        message: "Which role are they switching to?",
                        choices: () => {
                            let choiceArray = [];

                            for (var j = 0; j < result.length; j++) {
                                const y = result[j];
                                choiceArray.push(`${y.title} /${y.id}`);
                            }
                            return choiceArray;
                        },
                    },
                ])
                .then((answer) => {
                    const splitArr = answer.employee.split('/');
                    const employeeName = splitArr[0];
                    const employeeId = splitArr[1];

                    const splitArrRole = answer.role.split('/');
                    const employeeTitle = splitArrRole[0];
                    const roleId = splitArrRole[1];

                    connection.query( // query to get employee info that we seleted in the first prompt
                        `SELECT employee.id, CONCAT(employee.first_name, employee.last_name) AS Employee, employee.role_id, role.title FROM employee INNER JOIN role ON role.id = employee.role_id
                        WHERE employee.id = ${employeeId.toString()}; `,
                        (errAgain, resultsAgain) => {
                            if (errAgain) throw errAgain;
                            
                            let chosenRoleID;

                                if (resultsAgain.role_id === roleId) {

                                    console.log("This employee is already at this role.");
                                    
                                } else {
                                    chosenRoleID = roleId;

                                    connection.query(
                                        "UPDATE orgChart_db.employee SET ? WHERE ?",
                                        [
                                            {
                                                role_id: chosenRoleID,
                                            },
                                            {
                                                id: employeeId,
                                            },
                                        ],
                                        (error) => {
                                            if (error) throw error;
                                            console.log("Employee role as been updated.");
                                        }
                                    );
                                }
                            
                        }
                    );
                });
        });
    });
};

