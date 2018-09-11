var express = require("express");
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");

var User = require("./models/user");
var studentList = [
  { name: "Rajiv Yadav", studentId: "123456789", department: "MS SE" },
  { name: "Tuan Ung", studentId: "123456782", department: "MS SE" },
  { name: "First Last", studentId: "123456781", department: "MS CMPE" }
];
var app = express();
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use((req, res, next) => {
  if (req.cookies.userId && !req.session.user) {
    req.clearCookie("userId");
  }
  next();
});

app.use(
  session({
    secret: "cmpe273_nodejs_homework",
    resave: false,
    saveUninitialized: true
  })
);

app.get("/", function(req, res) {
  if (req.session.user) {
    res.render("home");
  } else {
    res.render("login");
  }
});

app.get("/home", function(req, res) {
  if (req.session.user) {
    console.log("Session data: " + req.session);
    res.render("home");
  } else {
    res.render("login");
  }
});

app.post("/login", function(req, res) {
  if (req.session.user) {
    res.render("home");
  } else {
    console.log("Inside Login Post Reqyest");
    console.log("Request body username:" + req.body.username);
    console.log("Request body password:" + req.body.password);
    if (
      req.body.username === User.username &&
      req.body.password === User.password
    ) {
      req.session.user = User;
      res.redirect("/home");
    } else {
      res.render("login");
    }
  }
});

app.post("/add", function(req, res) {
  if (req.session.user) {
    console.log("\nInside add route request");
    var studentAdded = {
      name: req.body.stdName,
      studentId: req.body.stdId,
      department: req.body.stdDepartment
    };
    studentList.push(studentAdded);
    res.redirect("/report");
    console.log("Student Added Successfully : " + JSON.stringify(studentAdded));
  } else {
    res.render("login");
  }
});

app.get("/report", function(req, res) {
  if (req.session.user) {
    console.log("\nInside report route request");
    console.log("Session data : " + req.session);
    res.render("report", { users: studentList });
  } else {
    res.render("login");
  }
});

app.post("/delete", function(req, res) {
  if (req.session.user) {
    console.log("\nInside delete route request");
    console.log("Student ID will be deleted: :" + req.body.stdId);
    var newList = [];
    studentList.forEach(element => {
      if (element.studentId !== req.body.stdId) newList.push(element);
    });
    studentList = newList;
    res.redirect("/report");
    console.log("Student deleted successfully");
  } else {
    res.render("login");
  }
});

app.listen(8080);
console.log("Server starts listening on port 8080");
