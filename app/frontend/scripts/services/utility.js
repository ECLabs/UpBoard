(function(){

    'use strict';

    /**
     * @ngdoc service
     * @name upBoardApp.utility
     * @description
     * # utility
     * Factory in the upBoardApp.
     */
    angular.module('upBoardApp')
      .factory('utility', utility);
  
    utility.$inject = ['$http', '$log'];
    function utility($http, $log) {

        return {
          activateWebCam: function(video){
                      
              navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || 
                                       navigator.mozGetUserMedia || navigator.msGetUserMedia || 
                                       navigator.oGetUserMedia;

              if (navigator.getUserMedia) {
                navigator.getUserMedia({video: true, audio: false}, handleVideo, videoError);
              }

              function handleVideo(stream) {
                video.src = window.URL.createObjectURL(stream);
                video.volume = 0;
              }

              function videoError(e) {
                console.log('error, no webcam support found');
              }
          },
            
          calculateSlideTime: function(data){
            
              var slideTime = 0; // default
            
              if(data.timing.slideTime != null) {
                  
                  // majority of slide types
                  slideTime = data.timing.slideTime;
              }
              else if(data.timing.openFirstSection) {
               
                  // bio panel section has different time parameters
                  slideTime = data.timing.openFirstSection + ((data.timing.openSection + data.timing.sectionTime) * data.content.content.length);
              }
              return slideTime;
          },
          
          camelToHyphen: function(str){
            
            // return camel cased string as hyphen separated lower cased string
            return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
          },

          cloneArray: function(a){
            
            // performance test says this is the fastest way
            var b = [];
            
            if(a != null){
              var b = new Array(a.length);
              var i = a.length;
              while(i--) { b[i] = a[i]; }
            }
            return b;
          },
            
          extractFromAddress: function(components, type){
              
              for(var i = 0; i < components.length; i++){
                  for(var j = 0; j < components[i].types.length; j++){
                      if(components[i].types[j] == type) return components[i].long_name;
                  }
              }
              return '';
          },
          
          getServerTime: function(){
            return $http.get('/time');
          },
            
          setEntryTransition: function (element, data) {
              
              // remove previous exit transition style if it exists
              element.removeClass (function (index, css) {return (css.match (/(^|\s)ub-\S+/g) || []).join(' ');});
              element.addClass('ub-' + data.transitions.entry);
              element.attr('style', 'animation-duration:' + data.timing.transitionTime + 'ms');
          },
            
          setExitTransition: function (element, data){
              
              // remove previous entry transition style if it exists
              element.removeClass (function (index, css) {return (css.match (/(^|\s)ub-\S+/g) || []).join(' ');});
              element.addClass('ub-' + data.transitions.exit);
          },
            
          toCamelCase: function(text){
              var words = text.split(" ");
              var word = null;
              var camelCasedString = "";

              for(i in words){
                word = words[i];
                camelCasedString += word.charAt(0).toUpperCase() + word.substring(1, word.length) + ' ';
              }
              return camelCasedString;
          }
        };
      }
})();