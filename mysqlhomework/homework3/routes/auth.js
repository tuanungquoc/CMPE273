var passport = require("passport");
var settings = require("../config/setting");
require("../config/passport")(passport);
var express = require("express");
var jwt = require("jsonwebtoken");
var router = express.Router();
var db = require("../lib/dbconn");
var crypt = require("../lib/crypt");
router.post("/register", function(req, response) {
  if (!req.body.username || !req.body.password) {
    res.json({ success: false, msg: "Please pass username and password." });
  } else {
    var newUser = {
      username: req.body.username,
      password: req.body.password
    };
    // save the user
    // Attempt to save the user
    console.log(newUser);
    db.createUser(
      newUser,
      function(res) {
        response
          .status(201)
          .json({ success: true, message: "Successfully created new user." });
      },
      function(err) {
        console.log(err);
        return response.status(400).json({
          success: false,
          message: "That username address already exists."
        });
      }
    );
  }
});

router.post("/login", function(request, response) {
  db.findUser(
    {
      username: request.body.username
    },
    function(res) {
      var user = {
        id: res.userId,
        username: res.username
      };

      // Check if password matches
      crypt.compareHash(
        request.body.password,
        res.password,
        function(err, isMatch) {
          if (isMatch && !err) {
            // Create token if the password matched and no error was thrown
            var token = jwt.sign(user, settings.secret, {
              expiresIn: 10080 // in seconds
            });
            console.log(
              "Student log in with:" +
                request.body.username +
                " / " +
                request.body.password
            );
            response.status(200).json({ success: true, token: "JWT " + token });
          } else {
            response.status(401).json({
              success: false,
              message: "Authentication failed. Passwords did not match."
            });
          }
        },
        function(err) {
          console.log(err);
          response.status(401).json({
            success: false,
            message: "Authentication failed. User not found."
          });
        }
      );
    },
    function(err) {
      console.log(err);
      response.status(401).json({
        success: false,
        message: "Authentication failed. User not found."
      });
    }
  );
});

module.exports = router;
