var express = require('express');


var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(getPointbyId(1)));
});

module.exports = router;


