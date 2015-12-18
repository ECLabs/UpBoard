var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
  var options = {
    root: __dirname + '/../../frontend/'
  };
  res.sendFile('index.html', options);
});

router.get('/time', function(req, res, next){
  res.header("Content-Type", "application/json");
  res.send({now:new Date().getTime()});
})

module.exports = router;
