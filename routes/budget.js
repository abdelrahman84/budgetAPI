var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Budget = mongoose.model('Budget');

const { check, validationResult } = require('express-validator');


let jwt = require('jsonwebtoken');

let config = require('../jwt/config');
let middleware = require('../jwt/middleware');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});


router.post('/budget', [
    check('title', 'title can`t be left blank').isLength({ min: 1 }),
    check('cycle', 'budget cycle date is required!').isLength({ min: 1 }),
    check('user', 'user can`t be left blank').isLength({ min: 1 }),
], function (req, res, next) {
    const errors = validationResult(req);


    if (!errors.isEmpty()) {
        res.json({ status: 'error', message: errors.array() });
    } else {

        var data = {
            title: req.body.title,
            cycle: req.body.cycle,
            balance: 0,
            user: req.body.user
        };
        var budget = new Budget(data);
        budget.save(function (error) {
            console.log(budget);
            if (error) {
                throw error;
            }
            res.json({ status: 'success', budget });
        });
    }
});

router.get('/user_budget', [
    check('user_id', 'user_id can`t be left blank').isLength({ min: 1 }),
], function (req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.json({ status: 'error', message: errors.array() });
    } else {
       var query = Budget.find({'user': req.query.user_id});
       query.exec(async function(err, result) {
           if (err) {
               console.log(err);
               throw(err);
           }
           if (!result) {
               return res.json({ status: 'error', message: 'user doesn`t exist' })
           } else {
            res.json({ status: 'success', result });
           }
       })
         
    }
});



module.exports = router;
