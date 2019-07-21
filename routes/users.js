var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const cors = require('cors');

var config = require('./config/config');
var connection = mysql.createConnection(config.databaseOptions);

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// Login API
router.post('/login', cors(), function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  console.log('connection is created for login');
  connection.query("SELECT * FROM user  WHERE u_email = ? AND u_password=?", [req.body.email, req.body.password], function (err, result, fields) {

    if (!result || err) {
      console.log(err);
      res.send({ statusCode: res.statusCode, status: "error" });
    } else {
      delete result[0].u_password;
      delete result[0].u_cpassword;
      res.send({ statusCode: res.statusCode, status: "success", data: result[0] });
    }
  });
});

//Get all user info
router.post('/getAll', cors(), function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  console.log('connection is created for login');
  connection.query("SELECT * FROM user  WHERE u_id = ?", [req.body.u_id], function (err, result, fields) {

    if (result.length === 0 || err) {
      console.log(err);
      res.send({ statusCode: res.statusCode, status: "error" });
    } else {
      delete result[0].u_password;
      delete result[0].u_cpassword;
      res.send({ statusCode: res.statusCode, status: "success", data: result[0] });
    }
  });
  connection.end()
});

//Get Status
router.get('/getStatus', cors(), function (req, res, next) {
  connection.query("SELECT * FROM status", [req.body.email, req.body.password], function (err, result, fields) {
    if (result.length === 0 || err) {
      res.send({ statusCode: res.statusCode, status: "error" });
    } else {
      res.send({ statusCode: res.statusCode, status: "success", data: result });
    }
  });
  connection.end()
});


//// create New User  
router.post('/createUser', function (req, res, next) {
  console.log('connection is created for createUser');
  var userObject = {
    "u_name": req.body.u_name,
    "u_mobile": req.body.u_mobile,
    "u_altermobile": req.body.u_altermobile,
    "u_email": req.body.u_email,
    "u_address": req.body.u_address,
    "u_MachinePurchased": req.body.u_MachinePurchased,
    "u_dateOf_Purchased": req.body.u_dateOf_Purchased,
    "u_password": req.body.u_password,
    "u_cpassword": req.body.u_cpassword,
    "u_role": req.body.u_role,
    "u_roleType": req.body.u_roleType,
    "u_joinDate": req.body.u_joinDate
  }
  connection.query('INSERT INTO user SET ?', userObject, function (err, result, fields) {
    if (err) throw err;
    result.message = "success";
    res.send(result)

  });
  connection.end()
});




module.exports = router;
