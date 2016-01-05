(function(){
    
    'use strict';

    /**
     * @ngdoc directive
     * @name upBoardApp.directive:ubFooter
     * @description
     * # footer
     */
    angular.module('upBoardApp')
      .directive('ubFooter', footer);
    
    footer.$inject = ['$log', '$interval', 'mapsGoogleApis', 'openWeatherMap'];
    function footer($log, $interval, mapsGoogleApis, openWeatherMap) {
        return {
          templateUrl: '/app/frontend/scripts/directives/ub-footer.tpl.html',
          restrict: 'E',
          replace: true,
          scope: {
              data: '=',
              logo: '='
          },
          link: function postLink(scope, element, attrs) {
              
              // update the weather
              function updateWeather(){
                  if(scope.zip != null){
                      openWeatherMap.getWeather(scope.zip).success(function(data){
                          scope.weather = Math.floor(data.main.temp) + ' ºF ' + data.weather[0].main;
                      });
                  }
              }
              
              // set zip with callback function
              function setZip(postalCode){
                  //$log.debug(postalCode);
                  scope.zip = postalCode;
                  updateWeather();
              };
              
              mapsGoogleApis.getPostalCode(setZip);
              
              // set clock
              function tick() { scope.clock = Date.now(); }
              tick();
              
              $interval(tick, 1000); // update the clock every second
              $interval(updateWeather, 60000); // update weather every minute
              
              // update footer content each time slide changes
              scope.$watch(function(){return scope.data != null ? scope.data.slideId : null}, function(){
                 
                  if(scope.data != null && scope.data.content != null){

                      // need to clear out if caption is null
                      scope.caption = scope.data.content.caption != null ? scope.data.content.caption : null;
                  }
              });
          }
        };
      }
    
})();