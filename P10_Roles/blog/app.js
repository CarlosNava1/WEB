var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');
var indexRouter = require('./routes/index');
var postsRouter = require('./routes/post');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({secret: "Blog 2024", resave: false, saveUninitialized: true}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method', {methods: ["POST", "GET"]}));
app.use(partials());
app.use(function(req, res, next) {

  console.log(">>>>>>>>>>>>>>", req.session.loginUser);

  // To use req.loginUser in the views
  res.locals.loginUser = req.session.loginUser && {
    id: req.session.loginUser.id,
    username: req.session.loginUser.username,
    email: req.session.loginUser.email,
    isAdmin: req.session.loginUser.isAdmin
  };

  next();
});
app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/', loginRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// Dynamic Helper:
app.use(function(req, res, next) {
  // Para usar req.loginUser en las vistas
  res.locals.loginUser = req.session.loginUser && {
    id: req.session.loginUser.id,
    username: req.session.loginUser.username,
    isAdmin: req.session.loginUser.isAdmin
  };

  next();
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

module.exports = app;
