(function(){
    'use strict';

    /**
     * @ngdoc directive
     * @name upBoardApp.directive:logo
     * @description
     * # logo
     */
    angular.module('upBoardApp')
      .directive('logo', logo);
    
    logo.$inject = ['$log'];
    function logo($log) {
        return {
          templateUrl: '/scripts/directives/logo.tpl.html',
          restrict: 'E',
          replace: true,
          scope:{
              data: "="
          },
          link: function(scope, element, attrs){

              var savedData; // use to remember for exit transition

              scope.$watch(attrs.ngShow, function(){

                  var isShown = scope.$eval(attrs.ngShow);

                  if(isShown){
                      $log.debug('about to show logo');

                      element.removeClass('ub-' + scope.data.transitions.exit);
                      element.addClass('ub-' + scope.data.transitions.entry);
                      element.attr('style', 'transition-duration:' + scope.data.timing.transitionTime + 'ms');

                      savedData = scope.data;
                  }
                  else if(scope.data != null){
                      $log.debug('about to hide logo, next type on deck: ' + scope.data.type);
                      element.removeClass('ub-' + savedData.transitions.entry);
                      element.addClass('ub-' + savedData.transitions.exit);
                  }
              });
          }
        };
    }
})();