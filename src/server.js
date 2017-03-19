var express = require('express');
var async = require('async');
var pg = require('pg');
var Yelp = require('yelp');

// Request YelpAPI token

var yelp = new Yelp({
    consumer_key: 'EVsKNcmCUWj5Xt8i7MR4cA',
    consumer_secret: 'nXsNJDK6Eo3kBpSf71qFcLL0tkg',
    token: '6ke5KfZ06Hu8uZLnvsyZklrHQgt_CugZ',
    token_secret: 'rJ4GVE7ihnbHwNFc8ng3CvRfMns',
});


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

yelp.search({ term: 'food', location: 'Vancouver' })
    .then(function (data) {
      var dataObj = createFoodPoints(data);

      pg.connect(config, function (err, client, done) {

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
                  var pointID = 0;
                  var orderNum = 0;
                  dataObj.forEach(function (business) {

                      client.query("INSERT INTO points(point_id, tour_id, name, address, lat, lon, order_in_tour, audio_url, image_url, categories, yelp_rating) VALUES (" + pointID + "," + 1 + ",'" + business['name'] + "','" + business['address'] + "',"  + business['lat'] + "," + business['lon'] + "," + orderNum + ",'" +  business['audioURL'] + "','"  +business['imageUrl'] + "','" + business['categories'] + "'," + business['rating'] + ")");
                      pointID++;
                      orderNum++;
                  });
              }])
      })
    })
    .catch(function (err) {
        console.error(err);
    })

yelp.search({ term: 'art', location: 'Vancouver' })
    .then(function (data) {
        console.log(data);
        var dataObj = createArtPoints(data);
        console.log(dataObj);

        /*pg.connect(config, function (err, client, done) {

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
                    var pointID = 0;
                    var orderNum = 0;
                    dataObj.forEach(function (business) {

                        client.query("INSERT INTO points(point_id, tour_id, name, address, lat, lon, order_in_tour, audio_url, image_url, categories, yelp_rating) VALUES (" + pointID + "," + 1 + ",'" + business['name'] + "','" + business['address'] + "',"  + business['lat'] + "," + business['lon'] + "," + orderNum + ",'" +  business['audioURL'] + "','"  +business['imageUrl'] + "','" + business['categories'] + "'," + business['rating'] + ")");
                        pointID++;
                        orderNum++;
                    });
                }])
        })*/
    })
    .catch(function (err) {
        console.error(err);
    })


function createArtPoints(data) {
    var resultArray = [];



}


function createFoodPoints(data) {
  var resultArray = [];

  var regionObj = data["region"];
  var span = regionObj["span"];
  var businessArray = data["businesses"];
  //console.log(businessArray);

 businessArray.forEach(function(business) {
    //console.log("in businesses");
    //console.log(business);
    var pointObj = {}
    pointObj["tourid"] = "";
    pointObj["point"] = "";
    pointObj['rating'] = business['rating'];
    pointObj["name"] = business["name"];
    var location = business["location"];
    pointObj["address"] = location["address"][0];

    var coords = location["coordinate"];
    //console.log("coords:" + coords);
    pointObj['lat'] = coords["latitude"];
    pointObj['lon'] = coords["longitude"];
    pointObj['orderInTour'] = 0;
    pointObj['audioURL'] = "";
    pointObj['imageUrl'] = business['image_url'];
    pointObj['categories'] = "food";
    //console.log(pointObj);
    resultArray.push(pointObj);
  })

  return resultArray;
}

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
          "yelp_rating DECIMAL" +
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
