var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser')
var mysql = require('mysql');
var config = require('./routes/config/config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var complaintRouter = require('./routes/complaint');
var cors = require('cors');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
var corsOptions = {
    origin: function (origin, callback) {
        var isWhitelisted = true;
        callback(null, isWhitelisted);
    },
    exposedHeaders: ['Content-Disposition', 'Content-Type'],
    credentials: true,
    maxAge: 2592000
};
app.use(cors(corsOptions));
app.use(logger('dev'));
app.all('/*', function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Origin", req.headers.origin); // * = restrict it to the required domain, req.headers.origin = allow cross domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, X-Access-Token, X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/complaint', complaintRouter);
app.get('/getData', function (req, res) {
    console.log("hi from server");
    res.status(200).send({ message: "Hi Raushan, How are You" });
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// var connection;
// try {
//     function handleDisconnect() {
//         console.log("handleDisconnect");
//         connection = mysql.createConnection(config.databaseOptions);
//         // console.log(connection);
//         // Recreate the connection, since
//         connection.connect(function (err) {              // The server is either down
//             if (err) {                                     // or restarting (takes a while sometimes).
//                 console.log('error when connecting to db:', err);
//                 setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
//             }                                     // to avoid a hot loop, and to allow our node script to
//         });    
//                             // process asynchronous requests in the meantime.
//         connection.on('error', function (err) {
//             console.log('db error', err);
//             if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//                 handleDisconnect();
//             } else {
//                 mysql.createConnection(config.databaseOptions);
//                 console.log("got here",err);
//                 throw err;

//             }
//         });
//         connection.destroy();
//     }

//     handleDisconnect();
// }
// catch (err) {
//     console.log("error in sql connection");
// }
//  handleDisconnect();








module.exports = app;
