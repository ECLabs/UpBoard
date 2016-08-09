(function(){
  
  'use strict';

  /**
   * @ngdoc directive
   * @name upBoardApp.directive:ubwIconLabelValue
   * @description
   * # ubwIconLabelValue
   */
  angular.module('upBoardApp')
    .directive('ubwIconLabelValue', ubwIconLabelValue);
  
  ubwIconLabelValue.$inject = ['$log', 'ubSocketIo'];
  function ubwIconLabelValue($log, ubSocketIo) {
    return {
      templateUrl: '/app/frontend/scripts/directives/widgets/ubw-icon-label-value.tpl.html',
      restrict: 'E',
      scope: {
        header: '@',
        values: '@', // expected format {icon: '', label: '', value: ''}
        event: '@'
      },
      link: function postLink(scope, element, attrs) {

        ubSocketIo.on(scope.event, function(data){
          $log.debug(data);
          scope.values = data.values;
        });
        
//        scope.$watch(function(){ return scope.values }, function(){
//          scope.valuesArr = scope.values.split(',');
//        });
      }
    };
  }
  
})();