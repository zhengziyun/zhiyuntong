var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var custom = require("./routes/custom");
var telrecord = require("./routes/telrecord");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: '123456',
  name: 'testapp',   //name指的是cookie的name, 默认cookie的name是connectid
  //cookie: {maxAge: 80000},   //设置maxAge:8000ms,即80s后session, 默认
  resave: false,
  saveUninitialized: true
}))


app.use('/', index);
app.use('/users', users);
app.use('/admin', admin);
app.use('/custom', custom);
app.use('/telrecord', telrecord);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen('8005', function(){
	console.log('server start...');
});

module.exports = app;
