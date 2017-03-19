/**
 * Created by alfredhong on 2017-03-19.
 */
var async = require('async');
var pg = require('pg');

// Request YelpAPI token



function getTourbyId(id) {
    pg.connect(config, function (err, client, done) {
        var finish = function () {
            done();
            process.exit();
        };

        if (err) {
            console.error('could not connect to cockroachdb', err);
            finish();
        }

        var query = client.query('SELECT * FROM tours WHERE tour_id = ' + id);
        var rows = [];
        query.on('row', function (row, result) {
            result.addRow(row);
            //  console.log(rows);
        })
        query.on('end', function (result) {
            console.log('done');
            console.log(result['rows']);
            return result['rows'];
        })
    })
}

function getPointbyId(id) {
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
        var rows = [];
        query.on('row', function (row, result) {
            result.addRow(row);
            //  console.log(rows);
        })
        query.on('end', function (result) {
            console.log('done');
            console.log(result['rows']);
            return result['rows'];
        })
    })
}

function getFullTourID(id){
    var tourObj = [];
    async.waterfall([
        function (next) {
            tourObj.concat(getTourbyId(id));
            var orderNum = 0;
            next();

        },function(next) {
            tourObj.concat(getPointbyId(id));
        }])
    return tourObj;
}