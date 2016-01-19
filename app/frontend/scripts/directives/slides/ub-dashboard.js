(function(){
  
  'use strict';

  /**
   * @ngdoc directive
   * @name upBoardApp.directive:ubDashboard
   * @description
   * # dashboard
   */
  angular.module('upBoardApp')
    .directive('ubDashboard', ubDashboard);
  
  ubDashboard.$inject = ['$log'];
  function ubDashboard($log) {
    return {
      templateUrl: '/app/frontend/scripts/directives/slides/ub-dashboard.tpl.html',
      restrict: 'E',
      replace: true,
      scope:{
        data: '=',
        index: '@'
      },
      link: function postLink(scope, element, attrs) {
        //element.text('this is the ubDashboard directive');
      }
    };
  }
  
})();