(function(){
    'use strict';

    /**
     * @ngdoc directive
     * @name upBoardApp.directive:ubLogo
     * @description
     * # logo
     */
    angular.module('upBoardApp')
      .directive('ubLogo', logo);
    
    logo.$inject = ['$log', 'utility'];
    function logo($log, utility) {
        return {
          templateUrl: '/app/frontend/scripts/directives/ub-logo.tpl.html',
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
                      $log.debug('about to show ' + scope.data.type);
                      utility.setEntryTransition(element, scope.data);
                      savedData = scope.data;
                  }
                  else if(savedData != null){
                      $log.debug('about to hide ' + savedData.type + ', next type on deck: ' + scope.data.type);
                      utility.setExitTransition(element, savedData);
                      savedData = null;
                  }
              });
          }
        };
    }
})();