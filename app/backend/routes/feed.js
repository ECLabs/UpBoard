module.exports = function(io){
  
  var express = require('express');
  var router = express.Router();

  router.post('/', function(req, res, next){
    
    //console.log('feed called');
    console.log(req.body);
    
    var events = req.body.event !== null ? req.body.event.split(',') : [];
    
    for(var i = 0; i < events.length; i++){
      io.emit(events[i], {source: req.body.source, content: req.body.content});
    }
    
    res.send('feed received');
  });
  
  return router;
}