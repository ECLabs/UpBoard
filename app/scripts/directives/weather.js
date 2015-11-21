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
    
    weather.$inject = ['$log', 'utility', 'openWeatherMap'];
    function weather($log, utility, openWeatherMap) {
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

                  if(isShown){
                      $log.debug('about to show weather');

                      var overlay = element.find('p')[0];
                      var video = element.find('video')[0];
                      
                      //reset data first    
                      overlay.innerHTML = '';
                      video.src = '';
                      
                      utility.activateWebCam(video);
                      
                      openWeatherMap.getWeather(scope.data.content.zip).success(function(data){
                          overlay.innerHTML = "<div>" + data.name + "</div>" + 
                                              data.main.temp + "º | " +
                                              data.weather[0].description;
                      });
                      
                      utility.setEntryTransition(element, scope.data);

                      savedData = scope.data;
                  }
                  else if(scope.data != null){
                      $log.debug('about to hide weather, next type on deck: ' + scope.data.type);
                      utility.setExitTransition(element, savedData);
                  }
              });
          }
        };
    }

})();