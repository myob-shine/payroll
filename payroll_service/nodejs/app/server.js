/*
    author: MYOB
    date: January 2017
*/

var express = require('express');
var proxy  = require('proxy-express');
var path = require('path');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var payment = require('./routes/payment');
var payments = require('./routes/payments');

var port = 3000;

var app = express();

// View engine
app.set('views', path.join(__dirname, 'views'));    // Set views folder location
app.set('view engine', 'ejs');                      // Specify views engine
app.engine('html', require('ejs').renderFile);      // Add ability to render html files

// Set static client folder
app.use(express.static(path.join(__dirname, 'client')));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', index);
app.use('/api', payment);
app.use('/api', payments);
app.use(proxy('tax:3001/api/tax', '/api/tax'));

app.listen(process.env.PORT || port, () => {
    //console.log('Server started on port: ' + port);
});

module.exports = app;
