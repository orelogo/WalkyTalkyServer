var express = require('express');
var async = require('async');
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

var config = {
  user: 'maxroach',
  host: 'localhost',
  database: 'bank',
  port: 26257
};

createTables(config);

function createTables(config) {

  pg.connect(config, function (err, client, done) {
    // Closes communication with the database and exits.
    var finish = function () {
      done();
      process.exit();
    };

    if (err) {
      console.error('could not connect to cockroachdb', err);
      finish();
    }
    async.waterfall([
      function (next) {
        // Create the "tours" table.
        client.query("CREATE TABLE IF NOT EXISTS tours (" +
          "tourId SERIAL, " +
          "name STRING, " +
          "description STRING" +
          "author STRING" +
          "date DATE" +
          "city STRING" +
          "category STRING" +
          "rating INT(1, 5)" +
          "imageUrl STRING" +
          "audioIntroUrl STRING" +
        ");", next);
      },
      function (next) {
        // Create the "points" table.
        client.query("CREATE TABLE IF NOT EXISTS points (" +
          "pointId INT PRIMARY KEY, " +
          "tourId INT" +
          "name STRING, " +
          "address STRING" +
          "lat DOUBLE" +
          "lon DOUBLE" +
          "orderInTour INT" +
          "audioUrl STRING" +
          "imageUrl STRING" +
          "categories STRING" +
          "yelpRating INT" +
        ");", next);
      },
      // function (next) {
      //   // Insert two rows into the "accounts" table.
      //   client.query("INSERT INTO tours (id, balance) VALUES (1, 1000), (2, 250);", next);
      // },
      // function (results, next) {
      //   // Print out the balances.
      //   client.query('SELECT id, balance FROM accounts;', next);
      // },
    ],
    function (err, results) {
      if (err) {
        console.error('error inserting into and selecting from accounts', err);
        finish();
      }

      console.log('Initial balances, not sure what this does:');
      results.rows.forEach(function (row) {
        console.log(row);
      });

      finish();
    });
  });
}
