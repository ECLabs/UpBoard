var express = require('express');
var Firebase = require('firebase');

var router = express.Router();

//var config		= JSON.parse(fs.readFileSync(path.join(__dirname, '/../../config.json'), 'utf8'));

var ref = new Firebase('https://boiling-heat-9947.firebaseio.com');
var FB_AUTH_TOKEN = 'BBwlPFTEMISGXNTvQz5nheil1SC3PgyPqIWxEvIV';
var TWILIO_ACCT_SID = 'ACb9118122c1cbe97d5c0d3c412990f192'; // TODO switch to jamil's account
var TWILIO_MSGSRVC_SID = 'MGbb4b73977ca0fdb73137280fdf6c716d' ;

/* POST message sent from Twilio */
router.post('/', function(req, res, next){
  console.log('message received: ' + req.query.message);
  console.log('message body: ' + req.body);
  
  // authenticate with firebase token
  ref.authWithCustomToken(FB_AUTH_TOKEN, function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } 
    else {
//      console.log("Authenticated successfully with payload:", authData);

      var acctSid = req.body.AccountSid;
      var msgSrvcSid = req.body.MessageServiceSid;
      
      // validate twilio account and message service
      if(acctSid == null || msgSrvcSid == null) {
        console.error('account sid: ' + acctSid + ' or message service sid: ' + msgSrvcSid + ' missing');
        return;
      }
      else if(acctSid !== TWILIO_ACCT_SID || msgSrvcSid !== TWILIO_MSGSRVC_SID){
        console.error('wrong twilio account id: ' + acctSid + ' or message service sid: ' + msgSrvcSid);
        return;
      }
      
      console.log('*** user passed account validation, continue');
      
      ref.child('users').once("value", function(snapshot){
        console.log(snapshot.val());
        
        var validUserAuthId; // store validated user id here, need for set
        
        // loop through users to
        var users = snapshot.val();
        var userAuthIds = Object.keys(users);
        
        // validate from phone number
        var phoneNumberFound = false;
        for(var i = 0; i < userAuthIds.length; i++){
          
          var user = users[userAuthIds[i]];
          
          console.log(req.body.From)
          if(user.phone != null && user.phone == req.body.From) {
            console.log('user phone number: ' + user.phone + ' found');
            validUserAuthId = userAuthIds[i];
            phoneNumberFound = true;
            break;
          }
        }
        if(!phoneNumberFound) {
          console.error('sending phone number: ' + req.body.From + ' not associated with any user');
          return;
        }
        
        console.log('*** user passed phone number validation, continue');
        
        if(req.body.Body == null){
          console.error('no message in the body');
          return;
        }
        
        console.log('*** user passed body message exists validation, continue');

        // validate user has an active deck with an sms slide
        ref.child('users/' + validUserAuthId + '/decks').orderByChild('active').equalTo(true).limitToFirst(1).once("value", function(snapshot){

          console.log(snapshot.key());
          console.log(snapshot.val());
          console.log(snapshot.val().length);
          
          var activeDecks = snapshot.val();
          if(activeDecks == null || activeDecks.length == 0){
            console.error("user has no active slide deck")
            return;
          }

          console.log('*** user passed active slide deck exists validation, contine');
          
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
          
          console.log('*** user passed sms slide exists validation, contine');
          
          
          console.log('*** update sms slide message');
          ref.child('users/' + validUserAuthId + '/decks/' + activeDeckId + '/slides/' + smsSlideId + '/content/message').set(req.body.Body);
        });
      });
    }
  });
  
  res.send('message received')
});

module.exports = router;
