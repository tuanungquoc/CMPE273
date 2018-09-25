var mysql = require("mysql");
var crypt = require("./crypt");
var config = require("../config/setting");
var db = {};
// Creating a connection object for connecting to mysql database
var pool = mysql.createPool({
  supportBigNumbers: true,
  bigNumberStrings: true,
  host: "localhost",
  user: "root",
  password: "",
  database: "db_studentmanagement",
  connectionLimit: 100 //important
});

db.findAllStudents = function(user, successCallback, failureCallback) {
  var sqlQuery = "SELECT * FROM tbl_students;";
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      failureCallback({ code: 100, status: "Error in connection database" });
    }
    connection.query(sqlQuery, function(err, rows, fields, res) {
      if (err) {
        failureCallback(err);
        return;
      }
      if (rows.length >= 0) {
        successCallback(rows);
      } else {
        failureCallback("Students not found.");
      }
    });
  });
};

db.deleteStudent = function(student, successCallback, failureCallback) {
  var sqlQuery =
    "UPDATE `db_studentmanagement`.`tbl_students` SET isDeleted = true WHERE `studentId` = '" +
    student.studentId +
    "';";
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      failureCallback({ code: 100, status: "Error in connection database" });
    }
    connection.query(sqlQuery, function(err, res) {
      if (err) {
        failureCallback(err);
        return;
      }
      successCallback({ studentId: student.studentId });
    });
  });
};

db.findUser = function(user, successCallback, failureCallback) {
  var sqlQuery =
    "SELECT * FROM `db_studentmanagement`.`tbl_users` WHERE `username` = '" +
    user.username +
    "';";
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      failureCallback({ code: 100, status: "Error in connection database" });
    }
    connection.query(sqlQuery, function(err, rows, fields, res) {
      if (err) {
        failureCallback(err);
        return;
      }
      if (rows.length > 0) {
        successCallback(rows[0]);
      } else {
        failureCallback("User not found." + user.username);
      }
    });
  });
};

db.addStudent = function(student, successCallback, failureCallback) {
  var sqlQuery =
    "INSERT INTO tbl_students (`studentId`, `full_name`, `department`) VALUES (" +
    mysql.escape(student.studentId) +
    " , " +
    mysql.escape(student.full_name) +
    " , " +
    mysql.escape(student.department) +
    ");";
  pool.getConnection(function(err, connection) {
    if (err) {
      connection.release();
      failureCallback({ code: 100, status: "Error in connection database" });
    }
    connection.query(sqlQuery, function(err, res) {
      if (err) {
        failureCallback({ error: err });
        return;
      }
      successCallback(student);
    });
  });
};

db.createUser = function(user, successCallback, failureCallback) {
  var passwordHash;
  crypt.createHash(
    user.password,
    function(res) {
      passwordHash = res;
      pool.getConnection(function(err, connection) {
        if (err) {
          connection.release();
          failureCallback({
            code: 100,
            status: "Error in connection database"
          });
        }
        connection.query(
          "INSERT INTO tbl_users VALUES ( " +
            mysql.escape(Math.random()) +
            "," +
            mysql.escape(user.username) +
            " , " +
            mysql.escape(passwordHash) +
            " ); ",
          function(err, rows, fields, res) {
            if (err) {
              console.log(err);
              failureCallback(err);
              return;
            }
            successCallback();
          }
        );
      });
    },
    function(err) {
      console.log(err);
      failureCallback();
    }
  );
};

module.exports = db;
