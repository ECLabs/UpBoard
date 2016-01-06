(function(){
  
  'use strict';

  /**
   * @ngdoc directive
   * @name upBoardApp.directive:ubSlideControls
   * @description
   * # ubSlideControls
   */
  angular.module('upBoardApp')
    .directive('ubSlideControls', ubSlideControls);
  
  ubSlideControls.$inject = ['$log', '$document', '$timeout'];
  function ubSlideControls($log, $document, $timeout) {
    return {
      templateUrl: '/app/frontend/scripts/directives/ub-slide-controls.tpl.html',
      restrict: 'E',
      scope:{
        firstFn: '&first',
        previousFn: '&previous',
        playFn: '&play',
        pauseFn: '&pause',
        nextFn: '&next',
        lastFn: '&last',
        repeat: '=',
        paused: '='
      },
      link: function postLink(scope, element, attrs, ctrl) {

        var timeoutPromise = null;
        
        $document.on('mouseover', function(){
          
          // cancel previous timeout
          if(timeoutPromise != null) $timeout.cancel(timeoutPromise);
          
          scope.hover = true;
          
          timeoutPromise = $timeout(function(){
            scope.hover = false;
          }, 5000);
          
        });
      }
    };
  }

})();