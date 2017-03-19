var express = require('express');
var router = express.Router();
var pg = require('pg');


/* GET home page. */
router.get('/', function (req, res) {
  var id = req.query.tourid;

  var config = {
    user: 'walkytalky',
    host: 'localhost',
    database: 'bank',
    port: 26257
  };

  var jsonResults;

  pg.connect(config, function (err, client, done) {
      var finish = function () {
          done();
          process.exit();
      };

      if (err) {
          console.error('could not connect to cockroachdb', err);
          finish();
      }

      var query = client.query('SELECT * FROM points WHERE tour_id = ' + id);
      query.on('end', function (result) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result['rows']));
      });
  });
});

module.exports = router;
