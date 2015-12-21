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
        
        // loop through users, return true aborts loop
        snapshot.forEach(function(childSnapshot){
          
          var userAuthId = childSnapshot.key();
          var userData = childSnapshot.val();
          
          console.log(userAuthId);
          
          // validate message
          if(req.body.Body == null){
            console.error('no Body specified, abort');
            return true;
          }
          console.log('[*] message passed Body exists validation, continue');
          
          if(req.body.To == null) {
            console.error('no To user specified, abort');
            return true;
          }
          console.log('[*] message passed To exists validation, continue');
          
          if(req.body.From == null) {
            console.error('no From user specified, abort');
            return true;
          }
          console.log('[*] message passed From exists validation, continue');
          
          // validate To number
          if(userData.twilioPhoneNumber == null || userData.twilioPhoneNumber != req.body.To){
            console.log('user twilio number does not exist or does not match');
            return;
          }
          console.log('[*] message passed twilio phone number validation, continue');
          
          // validate user has an active deck with an sms slide
          ref.child('users/' + userAuthId + '/decks').orderByChild('active').equalTo(true).limitToFirst(1).once("value", function(snapshot){

  //          console.log(snapshot.key());
  //          console.log(snapshot.val());
  //          console.log(snapshot.val().length);

            var activeDecks = snapshot.val();
            if(activeDecks == null || activeDecks.length == 0){
              console.error("user has no active slide deck")
              return;
            }

            console.log('[*] user passed active slide deck exists validation, continue');

            // retrieve id in decks array, should only be one
            var activeDeckId;
            for(var id in activeDecks){
              activeDeckId = id;
            }

            var activeDeck = activeDecks[activeDeckId];

            // find first sms slide - TODO modify later to send to different sms slides?
            var smsSlide;
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

            console.log('[*] user passed sms slide exists validation, continue');

            console.log('--> update sms slide message: ' + req.body.From + ', ' + req.body.Body + ', ' + new Date().getTime());

            // have to set values individually, doing in one shot overwrites all of content
            var contentPath = 'users/' + userAuthId + '/decks/' + activeDeckId + '/slides/' + smsSlideId + '/content';
            ref.child(contentPath + '/from').set(req.body.From);
            ref.child(contentPath + '/message').set(req.body.Body);
            ref.child(contentPath + '/timestamp').set(new Date().getTime());

          });
        });
      });
    }
  });

  res.send('message received');
});

module.exports = router;
