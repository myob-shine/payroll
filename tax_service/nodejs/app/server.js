/*
    author: MYOB
    date: January 2017
*/

var express = require('express');

var tax = require('./routes/tax');

var port = 3001;

var app = express();

app.use('/api', tax);

app.listen(process.env.PORT || port, () => {
    // console.log('Server started on port: ' + port);
});