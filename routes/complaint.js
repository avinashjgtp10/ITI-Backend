var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const cors = require('cors');

var config = require('./config/config');
// var connection = mysql.createConnection(config.databaseOptions);
let connection=config.databaseOptions;
// register new Complaint
router.post('/newComplaint', function (req, res, next) {
  console.log('connection is created for registerComplaint');
  var userObject = {
    "c_desc": req.body.c_desc,
    "c_photo": req.body.c_photo,
    "c_status": req.body.c_status,
    "c_assignTo": req.body.c_assignTo,
    "c_assignBy": req.body.c_assignBy,
  }
  connection.query('INSERT INTO complaint SET ?', userObject, function (err, result, fields) {
    if (err) res.send(err);
    res.send({ statusCode: res.statusCode, status: "success", data: result });
  });
});

// register new Complaint
router.get('/gelAllcomplaint', cors(), function (req, res, next) {
  connection.query('SELECT * FROM complaint', function (err, result, fields) {
    
    if (result.length === 0  || err) {
      res.send({ statusCode: res.statusCode, status: "error" });
    } else {
      res.send({ statusCode: res.statusCode, status: "success", data: result });
    }

  });
});

// register new Complaint
router.get('/getMachineType', cors(), function (req, res, next) {
  
  connection.query('SELECT * FROM type_of_machine', function (err, result, fields) {
    
    if (result.length === 0  || err) {
      res.send({ statusCode: res.statusCode, status: "error" });
    } else {
      res.send({ statusCode: res.statusCode, status: "success", data: result });
    }


  });
});



//getComplaint Info
router.get('/getComplaint/:id', function (req, res, next) {
  console.log('connection is created for getComplaint');
  connection.query('Select * from complaint where c_id= ?', req.params.id, function (err, result, fields) {
    if (err) res.send(err);
    res.send({ statusCode: res.statusCode, status: "success", data: result });
  });

});


//openomplaint and assing to me
router.post('/openComplaint', function (req, res, next) {
  connection.query("SELECT * FROM complaint where complaint.c_status=? and complaint.c_assignTo=?", [req.body.status, req.body.assignTo], function (err, result, fields) {
    if (err) res.send(err);
    res.send({ statusCode: res.statusCode, status: "success", data: result });
  });
});


//openomplaint and assing to me
router.post('/closedByComplaint', function (req, res, next) {
  connection.query("SELECT * FROM complaint where complaint.c_closedBy=?", [req.body.closedBy], function (err, result, fields) {
    if (err) res.send(err);
    res.send({ statusCode: res.statusCode, status: "success", data: result });
  });
  connection.end()
});

//update status
router.post('/updateComplaint', function (req, res, next) {
  
  connection.query("UPDATE `complaint` SET `c_status` = ? ,`e_desc` = ? WHERE (`c_id` = ?)", [req.body.status, req.body.e_desc, req.body.complaintId], function (err, result, fields) {
    if (result.length === 0  || err) {
      console.log(err);
      res.send({ statusCode: res.statusCode, status: "error" });
    } else {

      res.send({ statusCode: res.statusCode, status: "success", data: result[0] });
    }
  });

});

//Assign Complaint
router.post('/assignComplaint', function (req, res, next) {
  console.log([req.body.status, req.body.assignTo, req.body.complaintId]);
  connection.query("UPDATE `complaint` SET `c_status` = ? ,`c_assignTo` = ? WHERE (`c_id` = ?)", [req.body.status, req.body.assignTo, req.body.complaintId], function (err, result, fields) {
    console.log(result);
    if (result.length === 0  || err) {
      console.log(err);
      res.send({ statusCode: res.statusCode, status: "error" });
    } else {

      res.send({ statusCode: res.statusCode, status: "success", data: result[0] });
    }
  });

});







module.exports = router;
