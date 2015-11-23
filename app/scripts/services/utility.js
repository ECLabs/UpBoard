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
      .factory('utility', function () {

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
      });
})();