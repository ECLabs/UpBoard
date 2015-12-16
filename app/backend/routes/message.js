var express = require('express');
var Firebase = require('firebase');

var router = express.Router();

//var config		= JSON.parse(fs.readFileSync(path.join(__dirname, '/../../config.json'), 'utf8'));

var ref = new Firebase('https://boiling-heat-9947.firebaseio.com');
var FB_AUTH_TOKEN = 'BBwlPFTEMISGXNTvQz5nheil1SC3PgyPqIWxEvIV';

/* POST message sent from Twilio */
router.post('/', function(req, res, next){
//  console.log('message received: ' + req.query.message);
//  console.log('message body: ' + req.body);
  
  // authenticate with firebase token
  ref.authWithCustomToken(FB_AUTH_TOKEN, function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } 
    else {
//      console.log("Authenticated successfully with payload:", authData);

      ref.child('users').once("value", function(snapshot){
//        console.log(snapshot.val());
        
        var validUserAuthId; // store validated user id here, need for set
        
        // loop through users
        var users = snapshot.val();
        var userAuthIds = Object.keys(users);
        
        // validate To phone number
        // TODO twilio number can be associated with multiple users
        
//        console.log(req.body.To);
        var phoneNumberFound = false;
        for(var i = 0; i < userAuthIds.length; i++){
          
          var user = users[userAuthIds[i]];
          
          if(user.twilioPhoneNumber != null && user.twilioPhoneNumber == req.body.To) {
            console.log('user twilio phone number: ' + user.twilioPhoneNumber + ' found');
            validUserAuthId = userAuthIds[i];
            phoneNumberFound = true;
            break;
          }
        }
        if(!phoneNumberFound) {
          console.error('twilio phone number: ' + req.body.To + ' not associated with any user');
          return;
        }
        
        console.log('*** user passed twilio phone number validation, continue');
        
        if(req.body.Body == null){
          console.error('no message in the body');
          return;
        }
        
        console.log('*** user passed body message exists validation, continue');

        // validate user has an active deck with an sms slide
        ref.child('users/' + validUserAuthId + '/decks').orderByChild('active').equalTo(true).limitToFirst(1).once("value", function(snapshot){

//          console.log(snapshot.key());
//          console.log(snapshot.val());
//          console.log(snapshot.val().length);
          
          var activeDecks = snapshot.val();
          if(activeDecks == null || activeDecks.length == 0){
            console.error("user has no active slide deck")
            return;
          }

          console.log('*** user passed active slide deck exists validation, continue');
          
          // retrieve id in decks array, should only be one
          var activeDeckId;
          for(var id in activeDecks){
            activeDeckId = id;
          }
          
          var activeDeck = activeDecks[activeDeckId];
          
          // find first sms slide - modify later to send to different sms slides?
          var smsSlideId;
          for(var i = 0; i < activeDeck.slides.length; i++){
            var slide = activeDeck.slides[i];
            if(slide.type === 'sms'){
              smsSlide = slide;
              smsSlideId = i;
              break;
            }
          }
          
          if(smsSlide == null){
            console.error("user has no sms slide in the active deck");
            return;
          }
          
          console.log('*** user passed sms slide exists validation, continue');
          
          console.log('--> update sms slide message: ' + req.body.From + ', ' + req.body.Body + ', ' + new Date().getTime());
          ref.child('users/' + validUserAuthId + '/decks/' + activeDeckId + '/slides/' + smsSlideId + '/content').set({from:req.body.From, message:req.body.Body, timestamp:new Date().getTime()});
          
        });
      });
    }
  });

  res.send('message received');
});

module.exports = router;
