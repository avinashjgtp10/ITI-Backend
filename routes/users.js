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
router.get('/userDat', cors(), function (req, res, next) {
  connection.query("SELECT * FROM admission_form", [req.body.email, req.body.password], function (err, result, fields) {
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
router.get('/getStudentData', cors(), function (req, res, next) {
  let sql = "select * from admission_form ";
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
  var userObject = [[
  req.body.Address, 
  req.body.Adharno,
  req.body.Anualincome, 
  req.body.DateOfBirth, 
  req.body.Gender, 
  req.body.Mobilenumber, 
  req.body.Religion, 
  req.body.StuentMobilenumber, 
  req.body.UDISno,
  req.body.caste,
  req.body.email,
  req.body.fathername,
  req.body.fatheroccupation,
  req.body.mothername,
  req.body.mothertoung,
  req.body.nationality,
  req.body.studentname,
  req.body.taluka,
  req.body.trade
  ]]
  getUser(req.body.email, req.body.StuentMobilenumber).then((status) => {
    if (!status) {
      let sql = "INSERT INTO admission_form (Address, Adharno,Anualincome, DateOfBirth, Gender,  Mobilenumber,  Religion, StuentMobilenumber,  UDISno,caste,email, fathername,fatheroccupation, mothername, mothertoung,nationality, studentname, taluka, trade) VALUES ?";
      connection.query(sql, [userObject], function (err, result, fields) {
        if (result === undefined || err) {
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
  let sql = "SELECT * FROM user where u_id=" + req.body.u_id;
  connection.query(sql, function (err, result, fields) {
    if (result === undefined || err) {
      res.send({ statusCode: res.statusCode, status: "error" + err });
    } else {
      res.send({ statusCode: res.statusCode, status: "success", data: result });
    }
  });
});

//Update User
router.post('/updateUserById', cors(), function (req, res, next) {
  let sql = "UPDATE user SET u_mobile=?,u_altermobile=?,u_password =? ,u_cpassword=?,u_name=?  WHERE u_id =?"
  connection.query(sql, [req.body.u_mobile, req.body.u_altermobile, req.body.u_password, req.body.u_cpassword, req.body.u_name, req.body.u_id], function (err, result, fields) {
    if (result === undefined || err) {
      res.send({ statusCode: res.statusCode, status: "error" + err });
    } else {
      res.send({ statusCode: res.statusCode, status: "success"});
    }
  });
});

//Delete User By Id
router.post('/deleteUserById', cors(), function (req, res, next) {
  let sql = "DELETE FROM user  where u_id =?"
  connection.query(sql, [req.body.u_id], function (err, result, fields) {
    if (result === undefined || err) {
      res.send({ statusCode: res.statusCode, status: "error" + err });
    } else {
      res.send({ statusCode: res.statusCode, status: "success"});
    }
  });
});


function getUser(email, mobile) {
  return new Promise((resolve, reject) => {
    let sql = "select * from admission_form ";
    connection.query(sql, function (err, result, fields) {
      if (result) {
        for (let i = 0; i < result.length; i++) {
          if (result[i].email === email || result[i].StuentMobilenumber === mobile) {
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
