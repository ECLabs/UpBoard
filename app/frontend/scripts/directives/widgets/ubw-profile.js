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
  
  ubwProfile.$inject = ['$log'];
  function ubwProfile($log) {
    return {
      templateUrl: '/app/frontend/scripts/directives/widgets/ubw-profile.tpl.html',
      restrict: 'E',
      replace: true,
      scope:{
        src: '@',
        name: '@',
        description: '@',
        degree: '@'
      },
      link: function postLink(scope, element, attrs) {
        
        
      }
    };
  }
})();