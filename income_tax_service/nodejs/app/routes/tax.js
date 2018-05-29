var express = require('express');
var router = express.Router();
var taxService = require('./taxService');

// Get income tax
router.get('/tax', (request, response, next) => {
    taxService.getIncomeTax(request, response, next);
});

module.exports = router;