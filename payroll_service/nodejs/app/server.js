/*
    author: MYOB
    date: January 2017
*/

var express = require('express');
var proxy = require('http-proxy-middleware');
var path = require('path');

var index = require('./routes/index');

var port = 3000;

var app = express();

app.use('/', index);
app.use('/api/tax', proxy({target: 'http://tax:3001', changeOrigin: true}));
app.use('/api/payments', proxy({target: 'http://payments:3002', changeOrigin: true}));
app.use('/api/payment', proxy({target: 'http://payments:3002', changeOrigin: true}));

// View engine
app.set('views', path.join(__dirname, 'views'));    // Set views folder location
app.set('view engine', 'ejs');                      // Specify views engine
app.engine('html', require('ejs').renderFile);      // Add ability to render html files

// Set static client folder
app.use(express.static(path.join(__dirname, 'client')));

app.listen(process.env.PORT || port, () => {
    //console.log('Server started on port: ' + port);
});

module.exports = app;
