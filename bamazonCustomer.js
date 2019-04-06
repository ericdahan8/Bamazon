var mysql = require("mysql");
var inquirer = require("../Bamazon/node_modules/inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});
////////////To show table

var query = "SELECT * FROM products";
connection.query(query, function(err, res) {
  console.log(res);
});

setTimeout(function() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "which Product ID would you like?",
        name: "id"
      }

      // {
      //   type: "input",
      //   message: "How many units would you like?",
      //   name: "quantity"
      // }
    ])
    .then(answers => {
      // buyItem(Response.id, response.quantity);
      //connects to database function and compares ID from the databse with answer.ID

      var query = "SELECT * FROM products WHERE ?";
      connection.query(
        query,
        {
          id: answers.id
        },
        ////indicating that if there is a product ID then select it
        function(err, res) {
          if (err) throw err;
          if (res && res.length) {
            console.log(res);
            //this needs to display correct price
            console.log("************************************");
            console.log("This item costs $" + res[0].Price);

            inquirer
              .prompt([
                {
                  type: "list",
                  message: "Would you like to purchase this?",
                  name: "list",
                  choices: ["Yes", "No"]
                }
              ])

              .then(answers => {
                if (answers.list === "Yes") {
                  inquirer
                    .prompt([
                      {
                        type: "input",
                        message: "How many would you like to purchase?",
                        name: "quantity"
                      }
                    ])

                    .then(answers => {
                      if (answers.quantity < res[0].stock_quantity) {
                        res[0].stock_quantity -= answers.quantity;
                        console.log(
                          " Thank you for your purchase, Enjoy your new " +
                            res[0].product_name
                        );
                        return console.log(
                          "Quantity Left:  " + res[0].stock_quantity
                        );
                      } else {
                        console.log("Insufficient Quantity");
                      }
                    });

                  //reduce quantity
                  // res[0].stock_quantity--;
                  // console.log("Enjoy your new " + res[0].product_name);
                  // return console.log("Quantity:  " + res[0].stock_quantity);
                } else {
                  console.log("Thanks for shopping");
                }
              });
          }
        }
      );
      connection.end();
    });
}, 500);

//then we want to reduce quantity if yes otherwise we want to indicate insufficient quantity
//once conpleted ask if they want to go ahead with the purchase.
//         inquirer
//           .prompt([
//             {
//               type: "input",
//               message: "How many would you like to purchase?",
//               name: "quantity"
//             }
//           ])

//           .then(answers => {
//             answers.quantity--;
//           });
