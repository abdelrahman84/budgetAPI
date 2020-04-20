var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
let bcrypt = require('bcrypt');

var User = mongoose.model('Users');

const { check, validationResult } = require('express-validator');

let jwt = require('jsonwebtoken');

let config = require('../jwt/config');
let middleware = require('../jwt/middleware');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/login', [
  check('password', 'password can`t be left blank').isLength({ min: 1 }),
  check('email').isEmail().withMessage('Please enter a valid email address').trim(),
], function (req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array() });
  } else {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email }).then(
      user => {
        if (!user) {
          return res.status(400).json({ error: 'user doesn`t exist' })
        }
        bcrypt.compare(password, user.password)
          .then((isMatch) => {
            if (!isMatch) {
              return res.status(400).json({ error: 'incorrect password, please check and try again' })
            } if (isMatch) {
              let token = jwt.sign({ username: user.username },
                config.secret,
                {
                  expiresIn: '24h'
                })
              res.json({ status: 'login success', user, token: token });
            }
          })
      }
    )

  }
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
  

    bcrypt.hash(req.body.password, 10, function (err, hash) {
      var data = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        username: req.body.username,
        password: hash
      };
      let token = jwt.sign({ username: req.body.username },
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
        res.json({ status: 'success', user, token: token });
      });
    });
  }
});

function findUserByEmail(email) {
  if (email) {
    return new Promise((resolve, reject) => {
      User.findOne({ email: email })
        .exec((err, doc) => {
          if (err) return reject(err)
          if (doc) return reject(new Error('This email already exists. Please enter another email.'))
          else return resolve(email)
        })
    })
  }

}


module.exports = router;
