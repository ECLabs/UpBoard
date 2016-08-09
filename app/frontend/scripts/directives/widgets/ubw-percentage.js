(function(){
  
  'use strict';

  /**
   * @ngdoc directive
   * @name upBoardApp.directive:ubwPercentage
   * @description
   * # ubwPercentage
   */
  angular.module('upBoardApp')
    .directive('ubwPercentage', ubwPercentage);
  
  ubwPercentage.$inject = ['$log', 'ubSocketIo'];
  function ubwPercentage($log, ubSocketIo) {
    return {
      templateUrl: '/app/frontend/scripts/directives/widgets/ubw-percentage.tpl.html',
      restrict: 'E',
      replace: true,
      scope:{
        header: '@',
        value: '@',
        event: '@'
      },
      link: function postLink(scope, element, attrs) {
        
          ubSocketIo.on(scope.event, function(data){
            $log.debug(data)
            scope.value = data.value;
          });
      }
    };
  }
})();