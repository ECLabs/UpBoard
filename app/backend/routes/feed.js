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
    
//    {"insider_name":"Bernie Sanders","risk_scores":{"A: Allegiance to the United States":10,"B: Foreign Influence":0,"C: Foreign Preference":6,"D: Sexual Behavior":4,"E: Personal Conduct":9,"F: Financial Considerations":2,"G: Alcohol Consumption":6,"H: Drug Involvement":4,"I: Psychological Conditions":7,"J: Criminal Conduct":10,"K: Handling Protected Information":2,"L: Outside Activities":1,"M: Use of Information Technology Systems":5,"total":5,"travel":0},"tweets":[{"location":{"name":"United States","latitude":"37.09024","longitude":"-95.712891"},"text":"","create_date":"1463195294392"}],"travel":[{"location_name":"China","reported_year":2016},{"location_name":"Japan","reported_year":2016},{"location_name":"Sweden","reported_year":2016},{"location_name":"United States","reported_year":2016}]}
    
    // send event to overall risk (average) and trending widgets
    var totalRisk = req.body.risk_scores.total;
    io.emit('eatonTotalRisk', {value: totalRisk});
    
    // send event to top risk factors widget
    io.emit('eatonRisks', {values: [req.body.risk_scores["A: Allegiance to the United States"], 
                                    req.body.risk_scores["B: Foreign Influence"], 
                                    req.body.risk_scores["C: Foreign Preference"], 
                                    req.body.risk_scores["D: Sexual Behavior"],
                                    req.body.risk_scores["E: Personal Conduct"],
                                    req.body.risk_scores["F: Financial Considerations"],
                                    req.body.risk_scores["G: Alcohol Consumption"],
                                    req.body.risk_scores["H: Drug Involvement"],
                                    req.body.risk_scores["I: Psychological Conditions"],
                                    req.body.risk_scores["J: Criminal Conduct"],
                                    req.body.risk_scores["K: Handling Protected Information"],
                                    req.body.risk_scores["L: Outside Activities"],
                                    req.body.risk_scores["M: Use of Information Technology Systems"]]});
    
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