(function(){
  
  'use strict';

  /**
   * @ngdoc directive
   * @name upBoardApp.directive:ubwStatus
   * @description
   * # ubwStatus
   */
  angular.module('upBoardApp')
    .directive('ubwStatus', ubwStatus);
  
  ubwStatus.$inject = ['$log'];
  function ubwStatus($log) {
    return {
      templateUrl: '/app/frontend/scripts/directives/widgets/ubw-status.tpl.html',
      restrict: 'E',
      replace: true,
      scope:{
        header: '@',
        labels: '@',
        values: '@' // valid values are running or stopped
      },
      link: function postLink(scope, element, attrs) {
        
        scope.labelsArr = scope.labels.split(',');
        
        scope.$watch(function(){ return scope.values }, function(){
          scope.valuesArr = scope.values.split(',');
        });
      }
    };
  }
})();