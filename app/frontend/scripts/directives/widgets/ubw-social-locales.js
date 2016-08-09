(function(){
  
  'use strict';

  /**
   * @ngdoc directive
   * @name upBoardApp.directive:ubwSocialLocales
   * @description
   * # ubwSocialLocales
   */
  angular.module('upBoardApp')
    .directive('ubwSocialLocales', ubwSocialLocales);
  
  ubwSocialLocales.$inject = ['$log', 'ubSocketIo'];
  function ubwSocialLocales($log, ubSocketIo) {
    return {
      templateUrl: '/app/frontend/scripts/directives/widgets/ubw-social-locales.tpl.html',
      restrict: 'E',
      scope: {
        header: '@',
        values: '@', // expected format {icon: '', label: '', value: ''}
        event: '@'
      },
      link: function postLink(scope, element, attrs) {

        function getTimeDiff(data){
          
          var diff = 0;
          var timeSuffix = '';

          var milliDiff = new Date().getTime() - new Date(Number.parseInt(data.value)).getTime();
          diff = milliDiff;
          timeSuffix = ' ms';

          if(milliDiff > 1000){

            var secDiff = Math.floor(milliDiff / 1000);
            diff = secDiff;
            timeSuffix = ' s';

            if(secDiff > 60) {

              // switch to minutes
              var minDiff = Math.floor(secDiff / 60);
              diff = minDiff;
              timeSuffix = ' m';

              if(minDiff > 60){

                // switch to hours
                var hourDiff = Math.floor(minDiff / 60);
                diff = hourDiff;
                timeSuffix = ' h';

                if(hourDiff > 24){

                  // switch to days
                  var dayDiff = Math.floor(hourDiff / 24);
                  diff = dayDiff;
                  timeSuffix = ' d';

                  if(dayDiff > 365){

                    // switch to years
                    var yearDiff = Math.floor(dayDiff / 365);
                    diff = yearDiff;
                    timeSuffix = ' y';
                  }
                }
              }
            }
          }
          data.timeDiff = diff + timeSuffix;
        }
        
        var locales = [];
        
        ubSocketIo.on(scope.event, function(data){
          $log.debug(data);

          if(data.values != null){

            // update stored locales
            for(var i = 0; i < locales.length; i++){
              getTimeDiff(locales[i]);
            }

            // add new locales with time diff and add to beginning of list
            for(var j = 0; j < data.values.length; j++){
              getTimeDiff(data.values[j]);
              locales.unshift(data.values[j]);

              // restrict to no more than 30 results in the array
              if(locales.length > 30) locales.pop();
            }
          }
          scope.values = locales;
        });
      }
    }
  }
  
})();