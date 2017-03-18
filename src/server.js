var express = require('express');
var pg = require('pg');

var app = express();
var port = 8000;

var allTours = require('./routes/all-tours');
var tour = require('./routes/tour');

// app.use(express.static('public'));
app.use('/all-tours', allTours);
app.use('/tour', tour);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(port);
console.log('server on');
