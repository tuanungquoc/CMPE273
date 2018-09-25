var express = require("express");
var router = express.Router();
var db = require("../lib/dbconn");
var passport = require("passport");
require("../config/passport")(passport);

/* GET ALL BOOKS */
router.get("/", passport.authenticate("jwt", { session: false }), function(
  request,
  response
) {
  var token = getToken(request.headers);
  if (token) {
    db.findAllStudents(
      {},
      function(res) {
        console.log("Student list:" + res);
        response.send(JSON.stringify(res));
      },
      function(err) {
        return response
          .status(520)
          .send({ sucess: false, msg: "Unable to get the student list" });
      }
    );
  } else {
    return response.status(403).send({ success: false, msg: "Unauthorized." });
  }
});

router.put("/", passport.authenticate("jwt", { session: false }), function(
  request,
  response
) {
  console.log("Student deleted:" + request.body.studentId);
  var token = getToken(request.headers);
  if (token) {
    console.log(request.body);
    db.deleteStudent(
      { studentId: request.body.studentId },
      function(res) {
        console.log("Student deleted:" + res.studentId);
        response.send(res);
      },
      function(err) {
        console.log(err);
        return response
          .status(520)
          .send({ sucess: false, msg: "Unable to delete the student" });
      }
    );
  } else {
    return response.status(403).send({ success: false, msg: "Unauthorized." });
  }
});

router.post("/", passport.authenticate("jwt", { session: false }), function(
  request,
  response
) {
  var token = getToken(request.headers);
  if (token) {
    console.log(request.body);
    db.addStudent(
      request.body,
      function(res) {
        console.log(
          "Student added:" +
            res.studentId +
            " , " +
            res.full_name +
            " , " +
            res.department
        );
        response.send(res);
      },
      function(err) {
        return response
          .status(400)
          .send({ sucess: false, msg: "Unable to add the student" });
      }
    );
  } else {
    return response.status(403).send({ success: false, msg: "Unauthorized." });
  }
});
// /* SAVE BOOK */
// router.post("/", function(req, res, next) {

// });

getToken = function(headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(" ");
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
