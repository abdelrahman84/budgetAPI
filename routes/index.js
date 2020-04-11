var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

var User = mongoose.model('Users');

var crypto = require('crypto'), hmac, signature;

const { check, validationResult } = require('express-validator');

const { matchedData, sanitize } = require('express-validator');

let jwt = require('jsonwebtoken');

let config = require('../jwt/config');
let middleware = require('../jwt/middleware');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/register', [
  check('first_name', 'First name can`t be left blank').isLength({ min: 1 }),
  check('last_name', 'Last name can`t be left blank').isLength({ min: 1 }),
  check('email').isEmail().withMessage('Please enter a valid email address').trim()
    .normalizeEmail().custom(value => {
      return findUserByEmail(value).then(User => {
        // if user email isn't unique throw error
      })
    }),
  check('username', 'username can`t be left blank').isLength({ min: 1 }),
  check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
    .matches(/\d/).withMessage('Password must contain one number'),
], function (req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.json({ status: 'error', message: errors.array() });
  } else {
    hmac = crypto.createHash('sha1', 'auth secret');
    var encPassword = '';

    if (req.body.password) {
      hmac.update(req.body.password);
      encPassword = hmac.digest('hex');
    }
    var data = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      username: req.body.username,
      password: encPassword
    };
    let token = jwt.sign({username: req.body.username},
      config.secret,
      {
        expiresIn: '24h'
      }) 
    var user = new User(data);
    user.save(function (error) {
      console.log(user);
      if (error) {
        throw error;
      }   
      res.json({ message: 'User saved successfully', user, token: token });
    });
  }
});

function findUserByEmail(email) {
  if(email) {
    return new Promise((resolve, reject) => {
      User.findOne({email: email})
       .exec((err, doc) => {
         if (err) return reject(err)
         if (doc) return reject(new Error('This email already exists. Please enter another email.'))
          else return resolve(email)
       })
    })
  }

}


module.exports = router;
