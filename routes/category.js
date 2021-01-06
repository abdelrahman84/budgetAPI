var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Category = mongoose.model('Category');

const { check, validationResult } = require('express-validator');


let jwt = require('jsonwebtoken');

let config = require('../jwt/config');
let middleware = require('../jwt/middleware');


router.post('/category', [
    check('title', 'title can`t be left blank').isLength({ min: 1 }),
], function (req, res, next) {
    const errors = validationResult(req);


    if (!errors.isEmpty()) {
        res.json({ status: 'error', message: errors.array() });
    } else {

        var data = {
            title: req.body.title,
        };
        var category = new Category(data);
        category.save(function (error) {
            console.log(category);
            if (error) {
                throw error;
            }
            res.json({ status: 'success', category });
        });
    }
});

module.exports = router;
