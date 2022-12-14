#!/usr/bin/env node

/*
  Ghost internally uses the `mysql` library which does not support the `caching_sha2_password`
  authentication method and hence does not work properly with MySQL 8.

  So we use this function to tell MySQL to authenticate our user using the
  `mysql_native_password` method by using the `mysql2` library which then allows Ghost to use
  our database with that same authentication method.
*/

var mysql = require("mysql2");

require("dotenv").config();

// alterAuthenticationMethod();
console.log("minor change");
function alterAuthenticationMethod() {
  if (!process.env.MYSQL_URL) {
    console.log("No MYSQL_URL found, skipping authentication method change");
    return;
  }
  if (!process.env.MYSQLPASSWORD) {
    console.log(
      "MYSQL PASSWORD not found, skipping authentication method change"
    );
    return;
  }
  var connection = mysql.createConnection(process.env.MYSQL_URL);
  connection.query(
    "ALTER USER `root`@`%` IDENTIFIED WITH mysql_native_password BY ?",
    [process.env.MYSQLPASSWORD],
    function (err, results, fields) {
      if (err)
        console.log("There was an error altering the authentication method.");

      connection.end(function (err) {
        if (err) console.log("There was an error closing the connection.");
      });
    }
  );
}
