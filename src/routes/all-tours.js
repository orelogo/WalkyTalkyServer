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
        })
        query.on('end', function (result) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result['rows']));
        })
    })
});

module.exports = router;
