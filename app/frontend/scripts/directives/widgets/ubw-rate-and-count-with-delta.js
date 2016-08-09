(function(){
  
  'use strict';

  /**
   * @ngdoc directive
   * @name upBoardApp.directive:ubwRateAndCountWithDelta
   * @description
   * # ubwRateAndCountWithDelta
   */
  angular.module('upBoardApp')
    .directive('ubwRateAndCountWithDelta', ubwRateAndCountWithDelta);
  
  ubwRateAndCountWithDelta.$inject = ['$log'];
  function ubwRateAndCountWithDelta($log) {
    return {
      templateUrl: '/app/frontend/scripts/directives/widgets/ubw-rate-and-count-with-delta.tpl.html',
      restrict: 'E',
      replace: true,
      scope: {
        header: '@',
        rate: '@',
        count: '@',
        delta: '@'
      },
      link: function postLink(scope, element, attrs) {
      }
    };
  }
  
})();