var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');

var config = require('config');
var db = mongojs(config.DBHost, ['payments']);

// Find all payments
router.get('/payments', (request, response, next) => {
    db.payments.find().sort({firstName: 1}, (err, payments) => {
        if (err) {
            response.send(err);
        }
        response.json(payments);
    });
});

module.exports = router;
