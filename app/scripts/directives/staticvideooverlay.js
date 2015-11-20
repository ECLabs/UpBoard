(function(){
    'use strict';

    /**
     * @ngdoc directive
     * @name upBoardApp.directive:staticVideoOverlay
     * @description
     * # staticVideoOverlay
     */
    angular.module('upBoardApp')
      .directive('staticVideoOverlay', staticVideoOverlay);
    
    staticVideoOverlay.$inject = ['$log'];
    function staticVideoOverlay($log) {
        return {
          templateUrl: '/scripts/directives/staticvideooverlay.tpl.html',
          restrict: 'E',
          replace: true,
          scope:{
              data: '='
          },
          link: function(scope, element, attrs){

              var savedData; // use to remember for exit transition

              scope.$watch(attrs.ngShow, function(){

                  var isShown = scope.$eval(attrs.ngShow);

                  if(isShown){
                      $log.debug('about to show video');

                      var overlay = element.find('p')[0];
                      var box = element.find('.box')[0];
                      var video = element.find('video')[0];  
                      
                      //reset data first    
                      overlay.innerHTML = '';
                      box.style.color = '';
                      box.style.animationName = '';
                      video.src = '';
                      
                      // set video data
                      overlay.innerHTML = scope.data.content.overlay; 
                      
                      box.style.color = scope.data.content.overlayColor;
                      box.style.animationName = 'overlay';
                      
                      video.src = scope.data.content.videoUrl;
                      video.play();
                      
                      element.removeClass('ub-' + scope.data.transitions.exit);
                      element.addClass('ub-' + scope.data.transitions.entry);
                      element.attr('style', 'transition-duration:' + scope.data.timing.transitionTime + 'ms');

                      savedData = scope.data;
                  }
                  else if(scope.data != null){
                      $log.debug('about to hide video, next type on deck: ' + scope.data.type);
                      element.removeClass('ub-' + savedData.transitions.entry);
                      element.addClass('ub-' + savedData.transitions.exit)
                  }
              });
          }
        };
      }   
})();