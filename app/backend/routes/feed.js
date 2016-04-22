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
    
    // send event to overall risk and trending widgets
    var totalRisk = req.body.risk_scores.total;
    io.emit('eatonTotalRisk', {value: totalRisk});
    
    // send event to top risk factors widget
    io.emit('eatonRisks', {values: [Math.ceil(req.body.risk_scores.travel / totalRisk * 100), Math.ceil(req.body.risk_scores.finance / totalRisk * 100), 
                                    Math.ceil(req.body.risk_scores.computer / totalRisk * 100), Math.ceil(req.body.risk_scores.foreign_contact / totalRisk * 100)]});
    
    // send event to overseas travel map
    var travelMap = {};
    travelMap.markers = [];
    travelMap.center = {};
    
    if(req.body.tweets != null){
      for(var i = 0; i < req.body.tweets.length; i++){
        
        var tweet = req.body.tweets[i];
        
        // add marker
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
        
        var diff = 0;
        var timeSuffix = '';
        
        var milliDiff = new Date().getTime() - new Date(Number.parseInt(tweet.create_date)).getTime();
        diff = milliDiff;
        timeSuffix = ' ms';
        
        if(milliDiff > 1000){
          
          var secDiff = Math.floor(milliDiff / 1000);
          diff = secDiff;
          timeSuffix = ' s';

          if(secDiff > 60) {

            // switch to minutes
            var minDiff = Math.floor(secDiff / 60);
            diff = minDiff;
            timeSuffix = ' m';

            if(minDiff > 60){

              // switch to hours
              var hourDiff = Math.floor(minDiff / 60);
              diff = hourDiff;
              timeSuffix = ' h';

              if(hourDiff > 24){

                // switch to days
                var dayDiff = Math.floor(hourDiff / 24);
                diff = dayDiff;
                timeSuffix = ' d';

                if(dayDiff > 365){

                  // switch to years
                  var yearDiff = Math.floor(dayDiff / 365);
                  diff = yearDiff;
                  timeSuffix = ' y';
                }
              }
            }
          }
        }
        
        location.value = diff + timeSuffix;
        
        locales.push(location);
      }
    }
    io.emit('eatonLocales', {values: locales});
    
    // send event to overseas travel map
    var overseasTravel = [];
    if(req.body.reported_travel != null){
      for(var i = 0; i < req.body.reported_travel.length; i++){
        
        var travel = req.body.reported_travel[i];
        
        var location = {};
        location.icon = 'https://s3.amazonaws.com/upboard/warning.png';
        location.label = travel.location_name;
        location.value = travel.reported_year;
        
        overseasTravel.push(location);
      }
    }
    io.emit('eatonTravel', {values: overseasTravel});
    
    
    res.send('eaton call received');
  });
  
  return router;
}