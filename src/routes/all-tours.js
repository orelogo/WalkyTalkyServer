var express = require('express');
var pg = require('pg');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    var config = {
        user: 'walkytalky',
        host: 'localhost',
        database: 'bank',
        port: 26257
    };

    pg.connect(config, function (err, client, done) {
        var finish = function () {
            done();
            process.exit();
        };

        if (err) {
            console.error('could not connect to cockroachdb', err);
            finish();
        }

        var query = client.query('SELECT * FROM tours');
        var rows = [];
        query.on('row', function (row, result) {
            result.addRow(row);
            console.log(rows);
        })
        query.on('end', function (result) {
            console.log('done');
            console.log(result['rows']);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result['rows']));
        })
    })







  /*res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify([
    { tour: 1 },
    { tour: 2 }
  ]));*/
});

module.exports = router;
