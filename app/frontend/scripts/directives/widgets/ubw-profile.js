(function(){
  
  'use strict';

  /**
   * @ngdoc directive
   * @name upBoardApp.directive:ubwProfile
   * @description
   * # ubwProfile
   */
  angular.module('upBoardApp')
    .directive('ubwProfile', ubwProfile);
  
  ubwProfile.$inject = ['$log', 'ubSocketIo'];
  function ubwProfile($log, ubSocketIo) {
    return {
      templateUrl: '/app/frontend/scripts/directives/widgets/ubw-profile.tpl.html',
      restrict: 'E',
      replace: true,
      scope:{
        src: '@',
        name: '@',
        description: '@',
        degree: '@',
        event: '@'
      },
      link: function postLink(scope, element, attrs) {
        
          ubSocketIo.on(scope.event, function(data){
            $log.debug(data)
            
            scope.name = data.name;
            
            if(scope.name === 'Bernie Sanders'){
              scope.src = 'https://s3.amazonaws.com/upboard/Bernie_Sanders.jpg'
            }
            else if(scope.name === 'Ted Cruz'){
              scope.src = 'https://s3.amazonaws.com/upboard/Ted_Cruz.jpg'
            }
          });
      }
    };
  }
})();