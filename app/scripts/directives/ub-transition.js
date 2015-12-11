(function(){
    'use strict';

    /**
     * @ngdoc directive
     * @name upBoardApp.directive:ubTransition
     * @description
     * # transition
     */
    angular.module('upBoardApp')
      .directive('ubTransition', transition);
    
    function transition() {
        return {
          templateUrl: '/app/scripts/directives/ub-transition.tpl.html',
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