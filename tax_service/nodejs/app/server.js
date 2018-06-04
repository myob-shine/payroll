/*
    author: MYOB
    date: January 2017
*/

var express = require('express');
var bodyParser = require('body-parser');

var tax = require('./routes/tax');

var port = 3001;

var app = express();

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', tax);

app.listen(process.env.PORT || port, () => {
    // console.log('Server started on port: ' + port);
});