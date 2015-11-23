(function(){
    'use strict';

    /**
     * @ngdoc directive
     * @name upBoardApp.directive:liveVideoOverlay
     * @description
     * # liveVideoOverlay
     */
    angular.module('upBoardApp')
      .directive('liveVideoOverlay', liveVideoOverlay);
    
    liveVideoOverlay.$inject = ['$log', 'utility'];
    function liveVideoOverlay($log, utility) {
        return {
          templateUrl: '/scripts/directives/livevideooverlay.tpl.html',
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
                      $log.debug('about to show ' + scope.data.type);

                      var overlay = element.find('p')[0];
                      var box = element.find('.box')[0];
                      var video = element.find('video')[0];
                      
                      //reset data first    
                      overlay.innerHTML = '';
                      video.src = '';
                      
                      utility.activateWebCam(video);

                      overlay.innerHTML = scope.data.content.overlay; 
                      
                      box.style.color = scope.data.content.overlayColor;
                      box.style.animationName = 'overlay';
                      
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