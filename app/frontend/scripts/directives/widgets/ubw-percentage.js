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
  
  ubwPercentage.$inject = ['$log'];
  function ubwPercentage($log) {
    return {
      templateUrl: '/app/frontend/scripts/directives/widgets/ubw-percentage.tpl.html',
      restrict: 'E',
      replace: true,
      scope:{
        header: '@',
        value: '@'
      },
      link: function postLink(scope, element, attrs) {
        
        
      }
    };
  }
})();