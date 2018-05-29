/*
    author: MYOB
    date: January 2017
*/

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var tax = require('./routes/tax');

var port = 3001;

var app = express();

// View engine
app.set('views', path.join(__dirname, 'views'));    // Set views folder location
app.set('view engine', 'ejs');                      // Specify views engine
app.engine('html', require('ejs').renderFile);      // Add ability to render html files

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api', tax);

app.listen(process.env.PORT || port, () => {
    // console.log('Server started on port: ' + port);
});