exports.getIncomeTax = function(req, res, next) {
    var taxableIncome = req.query.taxableIncome;

    var taxRate = 0;
    var taxAmount = 0;
    var taxThreshold = 0;

    if (taxableIncome > 18200 && taxableIncome <= 37000) {
        taxRate = 0.19;
        taxAmount = 0;
        taxThreshold = 18200;
    }
    else if (taxableIncome > 37000 && taxableIncome <= 80000) {
        taxRate = 0.325;
        taxAmount = 3572;
        taxThreshold = 37000;
    }
    else if (taxableIncome > 80000 && taxableIncome <= 180000) {
        taxRate = 0.37;
        taxAmount = 17547;
        taxThreshold = 80000;
    }
    else if (taxableIncome > 180000) {
        taxRate = 0.45;
        taxAmount = 54547;
        taxThreshold = 180000;
    }
    var incomeTax = Math.round((taxAmount + (Math.max(0, taxableIncome - taxThreshold)) * taxRate) / 12);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end('{"incomeTax":' + incomeTax + '}');
}