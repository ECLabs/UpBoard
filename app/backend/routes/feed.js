module.exports = function(io){
  
  var express = require('express');
  var router = express.Router();

  router.post('/', function(req, res, next){
    
    //console.log('feed called');
    console.log(req.body);
    
    io.emit(req.body.event, {feed: 'hello from the feed server'});
    
    res.send('feed received');
  });
  
  return router;
}