var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const cors = require('cors');

var config = require('./config/config');
// var connection = mysql.createConnection(config.databaseOptions);
let connection = config.databaseOptions;

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
    console.log(result.length);
    if (result.length === 0 || err) {
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
});

//Get user data
router.get('/getAnalysisData', cors(), function (req, res, next) {
  connection.query("SELECT * FROM user", [req.body.email, req.body.password], function (err, result, fields) {
    if (result.length === 0 || err) {
      res.send({ statusCode: res.statusCode, status: "error" });
    } else {
      res.send({ statusCode: res.statusCode, status: "success", data: result });
    }
  });

});


//Get All Customer
router.get('/getAllCustomer', cors(), function (req, res, next) {
  let sql = "select * from user ";
  connection.query(sql, function (err, result, fields) {
    if (result.length === 0 || err) {

      res.send({ statusCode: res.statusCode, status: "error" + err });
    } else {
      res.send({ statusCode: res.statusCode, status: "success", data: result });
    }

  });
});

//create New User  
router.post('/createUser', cors(), function (req, res, next) {
  var userObject = [[req.body.u_name, req.body.u_mobile, req.body.u_altermobile, req.body.u_email, req.body.u_address, req.body.u_MachinePurchased, req.body.u_dateOf_Purchased, req.body.u_password, req.body.u_cpassword,
  req.body.u_role,
  req.body.u_roleType,
  req.body.u_joinDate,
  req.body.u_purchase_con,
  req.body.u_note,
  req.body.u_MachineNo,
  req.body.u_ServicePeriod,
  req.body.u_WarrentyPeriod
]]
  getUser(req.body.u_email, req.body.u_mobile).then((status) => {
    if (!status) {
      let sql = "INSERT INTO user (u_name, u_mobile, u_altermobile, u_email, u_address, u_MachinePurchased, u_dateOf_Purchased, u_password, u_cpassword, u_role, u_roleType,u_joinDate,u_purchase_con,u_note,u_MachineNo,u_ServicePeriod,u_WarrentyPeriod) VALUES ?";
      connection.query(sql, [userObject], function (err, result, fields) {
        if ( result === undefined  || err) {
          console.log(result)
          res.send({ statusCode: res.statusCode, status: "error" + err });
        } else {
          res.send({ statusCode: res.statusCode, status: "success" });
        }
      });
    } else {
      res.send({ statusCode: res.statusCode, status: "error", message: "The email address or phone number you have entered is already registered!" });
    }
  })
});

router.post('/getUserById', cors(), function (req, res, next) {
  let sql = "SELECT * FROM user where u_id="+req.body.u_id;
      connection.query(sql, function (err, result, fields) {
        if ( result === undefined  || err) {
          res.send({ statusCode: res.statusCode, status: "error" + err });
        } else {
          res.send({ statusCode: res.statusCode, status: "success",data:result });
        }
      });
});





function getUser(email, mobile) {
  return new Promise((resolve, reject) => {
    let sql = "select * from user ";
    connection.query(sql, function (err, result, fields) {
      if (result) {
        for (let i = 0; i < result.length; i++) {
          if (result[i].u_email === email || result[i].u_mobile === mobile) {
            console.log(true)
            resolve(true)
            break
          }
        }
      } else {
        resolve(false)
      }
      resolve(false)
    });
  })
}

module.exports = router;
