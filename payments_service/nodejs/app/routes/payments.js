var express = require('express');
var router = express.Router();

var loki = require('lokijs');
var lokidb = new loki('example.db');
var payments = lokidb.addCollection('payments');

// Find all payments
router.get('/payments', (request, response, next) => {
    var results = payments.find();
    response.json(results);
});

// Find a payment
router.get('/payment/:id', (request, response, next) => {
    var results = payments.findOne({_id: Number(request.params.id)});
    response.json(results);
});

// Save a payment
router.post('/payment', (request, response, next) => {
    console.log("BODY: " + request.body);
    var payment = request.body;

    if (!payment.firstName || !payment.lastName || !payment.annualSalary || !payment.superRate) {
        response.status(400);
        response.json({
            "error": "Invalid data provided, please check..."
        });
    } else {
        // Check employee payment already exists
        var results = payments.find({ "firstName": payment.firstName, "lastName": payment.lastName });

        if (results.length == 0) {
            payments.insert(payment);
            console.log("DEBUG");
            response.json(payment);
        }  else {
            response.status(400);
                response.json({
                    "error": 'There is already an existing employee ' + payment.firstName + ' ' + payment.lastName
            });
        }
    }
});

// Delete payment
router.delete('/payment/:id', (request, response, next) => {
    var payment = payments.findOne({_id: Number(request.params.id)});
    payments.remove(payment);
    var results = payments.find();
    response.json(results);
});

module.exports = router;
