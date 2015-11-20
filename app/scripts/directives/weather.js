(function(){
    'use strict';

    /**
     * @ngdoc directive
     * @name upBoardApp.directive:weather
     * @description
     * # weather
     */
    angular.module('upBoardApp')
      .directive('weather', weather);
    
    weather.$inject = ['$log', 'openWeatherMap'];
    function weather($log, openWeatherMap) {
        return {
          templateUrl: '/scripts/directives/weather.tpl.html',
          restrict: 'E',
          replace: true,
          scope:{
              data: '='
          },
          link: function(scope, element, attrs){

              var savedData; // use to remember for exit transition

              scope.$watch(attrs.ngShow, function(){

                  var localStream;
                  var isShown = scope.$eval(attrs.ngShow);

                  function activateWebCam(video){
                      
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
                  }
                  
                  if(isShown){
                      $log.debug('about to show weather');

                      var overlay = element.find('p')[0];
                      var video = element.find('video')[0];
                      
                      //reset data first    
                      overlay.innerHTML = '';
                      video.src = '';
                      
                      activateWebCam(video);
                      
                      openWeatherMap.getWeather(scope.data.content.zip).success(function(data){
//                          $log.debug('weather directive');
//                          $log.debug(data);
                          overlay.innerHTML = "<div>" + data.name + "</div>" + 
                                              data.main.temp + "º | " +
                                              data.weather[0].description;
                      });
                      
                      element.removeClass('ub-' + scope.data.transitions.exit);
                      element.addClass('ub-' + scope.data.transitions.entry);
                      element.attr('style', 'transition-duration:' + scope.data.timing.transitionTime + 'ms');

                      savedData = scope.data;
                  }
                  else if(scope.data != null){
                      $log.debug('about to hide weather, next type on deck: ' + scope.data.type);
                      element.removeClass('ub-' + savedData.transitions.entry);
                      element.addClass('ub-' + savedData.transitions.exit)
                  }
              });
          }
        };
    }

})();