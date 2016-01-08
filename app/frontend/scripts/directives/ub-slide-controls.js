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
  
  ubSlideControls.$inject = ['$log', '$document', '$timeout', '$interval'];
  function ubSlideControls($log, $document, $timeout, $interval) {
    return {
      templateUrl: '/app/frontend/scripts/directives/ub-slide-controls.tpl.html',
      restrict: 'E',
      replace: true,
      scope:{
        firstFn: '&first',
        previousFn: '&previous',
        playFn: '&play',
        pauseFn: '&pause',
        nextFn: '&next',
        lastFn: '&last',
        repeat: '=',
        paused: '=',
        slideTime: '@time'
      },
      link: function postLink(scope, element, attrs) {

        scope.hover = false;
        scope.count = 0;
        scope.idleTime = 0;
        scope.pauseTick = false;
        scope.pauseIncrement = false;

        function tickProgress(){
          if(!scope.pauseTick) scope.count += 10;
        }
        
        function timerIncrement(){
          if(!scope.pauseIncrement) scope.idleTime++;
          if(scope.idleTime > 5)scope.hover = false;
        }

        $interval(tickProgress, 10);     // progress bar
        $interval(timerIncrement, 1000); // control hover

        $document.on('mousemove', function(){
          scope.idleTime = 0;
          scope.hover = true;
        });

        element.parent().on('click', function(){
          scope.idleTime = 5;
        });

        scope.mouseenter = function(){
          scope.idleTime = 0;
          scope.hover = true;
          scope.pauseIncrement = true;
        }

        scope.mouseleave = function(){
          scope.pauseIncrement = false;
        }

        // scope watch for new slide
        scope.$watch(function(){ return scope.slideTime }, function(){
          scope.count = 0;
        });
      }
    };
  }

})();