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

      ref.child('users').once("value", function(users){
        
        // loop through users, return true aborts loop
        users.forEach(function(user){
          
          var userAuthId = user.key();
          var userData = user.val();
          
          //console.log(userAuthId);
          
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
            console.log('user twilio number does not exist or does not match, skip');
            return;
          }
          console.log('[*] message passed twilio phone number validation, continue');
          
          // validate user has an active deck with an sms slide
          ref.child('users/' + userAuthId + '/decks').orderByChild('active').equalTo(true).limitToFirst(1).once("value", function(activeDecks){

  //          console.log(snapshot.key());
  //          console.log(snapshot.val());
  //          console.log(snapshot.val().length);

            var activeDeckData = activeDecks.val();
            if(activeDeckData == null || activeDeckData.length == 0){
              console.log("user has no active slide deck, skip")
              return;
            }

            console.log('[*] user passed active slide deck exists validation, continue');

            // retrieve id in decks array, should only be one
            var activeDeckId;
            for(var id in activeDeckData){
              activeDeckId = id;
            }

            ref.child('users/' + userAuthId + '/decks/' + activeDeckId + '/slides').once("value", function(slides){

              var smsSlideFound = false;
              
              // loop through slides
              slides.forEach(function(slide){
              
                var slideId = slide.key();
                var slideData = slide.val();
//                console.log(slideId);
//                console.log(slideData);
                
                // find sms slides
                if(slideData.type === 'sms'){

  //                var smsSlideId = i;
                  smsSlideFound = true;

                  console.log('[*] user passed sms slide exists validation, continue');

                  // have to set values individually, doing in one shot overwrites all of content
                  var contentPath = 'users/' + userAuthId + '/decks/' + activeDeckId + '/slides/' + slideId + '/content';

//                  console.log('content path: ' + contentPath);
                  
                  // check if a prefix exists
                  var prefix = slideData.content.prefix;
                  if(prefix != null){

                    // sms slide configured to expect a prefix, parse Body for prefix code
                    var prefixMatch = req.body.Body.match('^' + prefix);
                    if(prefixMatch !== null){

                      console.log('prefix found: ' + prefixMatch);

                      var msgBody = req.body.Body.replace(prefixMatch[0], ''); // remove prefix from message body

                      console.log('--> update sms slide message: ' + req.body.From + ', ' + msgBody + ', ' + new Date().getTime());
                      ref.child(contentPath + '/from').set(req.body.From);
                      ref.child(contentPath + '/message').set(msgBody);
                      ref.child(contentPath + '/timestamp').set(new Date().getTime());
                    }
                    else{
                      console.log('sms slide configured to expect a prefix ' + prefix + ', none found in message body, skip');
                    }
                  }
                  else{

                    // sms slide not configured to expect a prefix, send message
                    console.log('--> update sms slide message: ' + req.body.From + ', ' + req.body.Body + ', ' + new Date().getTime());
                    ref.child(contentPath + '/from').set(req.body.From);
                    ref.child(contentPath + '/message').set(req.body.Body);
                    ref.child(contentPath + '/timestamp').set(new Date().getTime());
                  }
                }
              });
              
              if(!smsSlideFound){
                console.log("user has no sms slide in the active deck, skip");
                return;
              }
              
            });
              
            
            
          });
        });
      });
    }
  });

  res.send('message received');
});

module.exports = router;
