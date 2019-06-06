var express = require('express');
var router = express.Router();
var mysql = require('mysql');
// var config = require('./config/config');
// var connection = mysql.createConnection(config.databaseOptions);

var config=require('./config/config');
var con= mysql.createConnection(config.databaseOptions);

/* GET home page. */
router.get('/', function(req, res, next) {
con.connect((err)=>{
  if(err) throw err;
  console.log("Connected");
})
  res.render('index', { title: 'Express1' });
});



module.exports = router;
