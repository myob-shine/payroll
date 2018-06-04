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

// Find a payment
router.get('/payment/:id', (request, response, next) => {
    db.payments.findOne({_id: mongojs.ObjectId(request.params.id)}, (err, payment) => {
        if (err) {
            response.send(err);
        }
        response.json(payment);
    });
});

// Save a payment
router.put('/payment', (request, response, next) => {
    console.log("HEEREERERE");
    var payment = request.body;

    if (!payment.firstName || !payment.lastName || !payment.annualSalary || !payment.superRate) {
        response.status(400);
        response.json({
            "error": "Invalid data provided, please check..."
        });
    } else {
        // Check employee payment already exists
        db.payments.findOne({ "firstName": payment.firstName, "lastName": payment.lastName }, (err, found) => {
            if (err) {
                response.send(err);
            } else if (!found) {
                db.payments.save(payment, (err, payment) => {
                    if (err) {
                        response.send(err);
                    }
                    response.json(payment);
                });
            }  else {
                response.status(400);
                    response.json({
                        "error": 'There is already an existing employee ' + payment.firstName + ' ' + payment.lastName
                });
            }
        });
    }
});

// Delete payment
router.delete('/payment/:id', (request, response, next) => {
    db.payments.remove({_id: mongojs.ObjectId(request.params.id)}, (err, payment) => {
        if (err) {
            response.send(err);
        }
        response.json(payment);
    });
});

module.exports = router;
