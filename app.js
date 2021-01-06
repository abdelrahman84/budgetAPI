var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var logger = require('morgan');

// var mongoose = require('mongoose');

// require('./models/user');
// require('./models/budget');
// require('./models/category');

// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/budget', {useNewUrlParser: true, useUnifiedTopology: true });

const eraseDatabaseOnSync = true;

import models, {connectDb} from './models';
connectDb().then(async() => {
  if (eraseDatabaseOnSync) {
    await Promise.all([
      models.Category.deleteMany({}),
    ]);

    createCategories();
}
});


const createCategories = async () => {
  const category1 = new models.Category({
    title: 'health',
  });
  const category2 = new models.Category({
    title: 'grocery',
  });
  const category3 = new models.Category({
    title: 'eat out',
  });
  const category4 = new models.Category({
    title: 'car',
  });
  const category5 = new models.Category({
    title: 'education',
  });
  const category6 = new models.Category({
    title: 'general',
  });
  await category1.save();
  await category2.save();
  await category3.save();
  await category4.save();
  await category5.save();
}




var cors = require('cors');

var index = require('./routes/index');
var users = require('./routes/users');
var budget = require('./routes/budget');
var category = require ('./routes/category')

var app = express();
app.use(cors({origin: 'http://localhost:3001'}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
let middleware = require('./jwt/middleware');

app.use('/', index);
app.use('/users', users);
app.use('/api', middleware.checkToken, budget);
app.use('/category', middleware.checkToken, category);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
