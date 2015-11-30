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
    
    ubFooter.$inject = ['$log', '$interval', 'openMapQuest']
    function ubFooter($log, $interval, openMapQuest) {
        return {
          templateUrl: 'scripts/directives/ub-footer.tpl.html',
          restrict: 'E',
          replace: true,
          scope: {
              data: '='
          },
          link: function postLink(scope, element, attrs) {
              
              scope.zip = openMapQuest.getZip();
              scope.clock = null;
              
              var tick = function() { scope.clock = Date.now(); }
              tick();
              $interval(tick, 60000); // update the clock every minute
              
              scope.weather = '55 º'; // TODO - switch to use navigator geolocation and openWeatherMap service
          }
        };
      }
    
})();