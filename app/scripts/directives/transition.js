(function(){
    'use strict';

    /**
     * @ngdoc directive
     * @name upBoardApp.directive:transition
     * @description
     * # transition
     */
    angular.module('upBoardApp')
      .directive('transition', transition);
    
    function transition() {
        return {
          templateUrl: 'scripts/directives/transition.tpl.html',
          restrict: 'E',
          replace: true,
          scope:{
            data: '='
          },
          link: function postLink(scope, element, attrs) {
            //element.text('this is the transition directive');
          }
        };
    }
})();