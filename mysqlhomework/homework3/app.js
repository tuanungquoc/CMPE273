var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var bodyParser = require("body-parser");

var students = require("./routes/students");
var auth = require("./routes/auth");

var app = express();

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/students", students);
app.use("/api/auth", auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;
