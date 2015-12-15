'use strict'
var express = require('express');
var exphbs  = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var admin = require('./routes/admin');
var api = require('./routes/api');
var users = require('./models/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
var hbs = exphbs.create({
    defaultLayout: false,
});

hbs.handlebars.loadPartial = function (name) {
  var partial = hbs.handlebars.partials[name];
  if (typeof partial === "string") {
    partial = hbs.handlebars.compile(partial);
    hbs.handlebars.partials[name] = partial;
  }
  return partial;
};

hbs.handlebars.registerHelper("block",
  function (name, options) {
    /* Look for partial by name. */
    var partial
      = hbs.handlebars.loadPartial(name) || options.fn;
    return partial(this, { data : options.hash });
});

hbs.handlebars.registerHelper("partial",
  function (name, options) {
    hbs.handlebars.registerPartial(name, options.fn);
});

hbs.handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
        
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  if(req.session && req.session.email){
    var promise = users.getuser(req.session.email);
    promise.then(function(result){
      if(result.length > 0){
        req.user = result[0];
        delete req.user.pass;
        res.locals.user = req.user;
      }
      next();
    });
  }
  else {
    next();
  }  
});

app.use('/admin', admin);
app.use('/api', api);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
