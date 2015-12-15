var express = require('express');
var Firebase = require('firebase');

var router = express.Router();

//var config		= JSON.parse(fs.readFileSync(path.join(__dirname, '/../../config.json'), 'utf8'));

var ref = new Firebase('https://boiling-heat-9947.firebaseio.com');

/* POST message sent from Twilio */
router.post('/', function(req, res, next){
  console.log('message received: ' + req.query.message);
  console.log('message body: ' + req.body);
  
  // parse request and save data to firebase
  ref.authWithPassword({
    "email":"ubadmin2@evanschambers.com",
    "password":"password"
  }, function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } 
    else {
      //console.log("Authenticated successfully with payload:", authData);

      ref.child('users/' + authData.uid + '/decks').orderByChild('active').equalTo(true).limitToFirst(1).on("value", function(snapshot){
        
        console.log(snapshot.key());
        console.log(snapshot.val());
        var activeDeck = snapshot.val()[0];
        for(var i = 0; i < activeDeck.slides.length; i++){
          var slide = activeDeck.slides[i];
          if(slide.type === 'sms'){
            console.log("found sms slide type, update message");
            console.log(slide);
            slide.content.message = "message set from post";
          }
        }
      });
    }
  });
  
  res.send('message received')
});

module.exports = router;
