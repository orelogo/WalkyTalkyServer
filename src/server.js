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
  user: 'walkytalky',
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
          "tour_id SERIAL PRIMARY KEY, " +
          "name STRING, " +
          "description STRING," +
          "author STRING," +
          "date DATE," +
          "city STRING," +
          "category STRING," +
          "rating INT," +
          "image_url STRING," +
          "audio_intro_url STRING" +
        ");", next);
      },
      function (next) {
        // Create the "points" table.
        client.query("CREATE TABLE IF NOT EXISTS points (" +
          "point_id SERIAL PRIMARY KEY, " +
          "tour_id INT REFERENCES tours," +
          "name STRING, " +
          "address STRING," +
          "lat DECIMAL," +
          "lon DECIMAL," +
          "order_in_tour INT," +
          "audio_url STRING," +
          "image_url STRING," +
          "categories STRING," +
          "yelp_rating INT" +
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

      console.log('Results:');
      results.rows.forEach(function (row) {
        console.log(row);
      });

      finish();
    });
  });
}
