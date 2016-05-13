module.exports = function(io){
  
  var express = require('express');
  var _ = require('lodash');
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
  
  router.post('/eaton', function(req, res, next){
    
    console.log(req.body);
    
    // send event to profile widget
    io.emit('eatonProfile', {name: req.body.insider_name});
    
    // send event to overall risk (average) and trending widgets
    var totalRisk = req.body.risk_scores.total;
    io.emit('eatonTotalRisk', {value: totalRisk});
    
    // send event to top risk factors widget
    io.emit('eatonRisks', {values: [req.body.risk_scores.travel, req.body.risk_scores.finance, 
                                    req.body.risk_scores.computer, req.body.risk_scores.foreign_contact]});
    
    // send event to overseas travel map
    var travelMap = {};
    travelMap.markers = [];
    travelMap.center = {};
    
    if(req.body.tweets != null){
      for(var i = 0; i < req.body.tweets.length; i++){
        
        var tweet = req.body.tweets[i];
        
        // add marker, Highcharts does not like String values
        travelMap.markers.push({lat: Number.parseInt(tweet.location.latitude), lng: Number.parseInt(tweet.location.longitude)});
        
        // center on last location
        if(i === req.body.tweets.length - 1){
          travelMap.center = {lat: Number.parseInt(tweet.location.latitude), lng: Number.parseInt(tweet.location.longitude), zoom: 4};
        }
      }
    }
    io.emit('eatonMap', travelMap);
    
    
    // send event to social locales map
    var locales = [];
    if(req.body.tweets != null){
      for(var i = 0; i < req.body.tweets.length; i++){
        
        var tweet = req.body.tweets[i];
        
        var location = {};
        location.icon = 'https://s3.amazonaws.com/upboard/twitter_bird.png';
        location.label = tweet.location.name;
        location.value = tweet.create_date;
        
        locales.push(location);
      }
    }
    io.emit('eatonLocales', {values: locales});
    
    // send event to overseas travel map
    var overseasTravel = [];
    if(req.body.travel != null){
      for(var i = 0; i < req.body.travel.length; i++){
        
        var travel = req.body.travel[i];
        
        var location = {};
        location.icon = travel.reported_year != null ? 'https://s3.amazonaws.com/upboard/green_white_checkmark.png' : 'https://s3.amazonaws.com/upboard/warning.png';
        location.label = travel.location_name;
        location.value = travel.reported_year != null ? travel.reported_year : '';
        
        overseasTravel.push(location);
      }
    }
    io.emit('eatonTravel', {values: overseasTravel});
    
    
    res.send('eaton call received');
  });
  
  return router;
}