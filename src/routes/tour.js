var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify([
    {point: 1},
    {point: 2}
  ]));
});

module.exports = router;
