(function(){
    
    'use strict';

    /**
     * @ngdoc directive
     * @name upBoardApp.directive:ubFooter
     * @description
     * # ubFooter
     */
    angular.module('upBoardApp')
      .directive('ubFooter', ubFooter);
    
    ubFooter.$inject = ['$log', '$interval', 'mapsGoogleApis', 'openWeatherMap'];
    function ubFooter($log, $interval, mapsGoogleApis, openWeatherMap) {
        return {
          templateUrl: 'scripts/directives/ub-footer.tpl.html',
          restrict: 'E',
          replace: true,
          scope: {
              data: '='
          },
          link: function postLink(scope, element, attrs) {
              
              // update the weather
              function updateWeather(){
                  if(scope.zip != null){
                      openWeatherMap.getWeather(scope.zip).success(function(data){
                          scope.weather = data.main.temp + "º | " + data.weather[0].main;
                      });
                  }
              }
              
              // set zip with callback function
              function setZip(postalCode){
                  $log.debug(postalCode);
                  scope.zip = postalCode;
                  updateWeather();
              };
              
              mapsGoogleApis.getPostalCode(setZip);
              
              // set clock
              function tick() { scope.clock = Date.now(); }
              tick();
              
              $interval(tick, 1000); // update the clock every second
              $interval(updateWeather, 60000); // update weather every minute
          }
        };
      }
    
})();