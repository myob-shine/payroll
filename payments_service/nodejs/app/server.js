/*
    author: MYOB
    date: January 2017
*/

var express = require('express');
var bodyParser = require('body-parser');

var payments = require('./routes/payments');

var port = 3002;

var app = express();

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', payments);

app.listen(process.env.PORT || port, () => {
    //console.log('Server started on port: ' + port);
});

module.exports = app;
