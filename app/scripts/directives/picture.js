(function(){
    'use strict';

    /**
     * @ngdoc directive
     * @name upBoardApp.directive:picture
     * @description
     * # picture
     */
    angular.module('upBoardApp')
      .directive('picture', picture);
    
    picture.$inject = ['$log'];
    function picture($log) {
        return {
          templateUrl: '/scripts/directives/picture.tpl.html',
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
                      $log.debug('about to show picture');
                      
                      //reset data first    
                      element.find('p')[0].innerHTML = ''
                      element.find('img')[0].src = '';
                      
                      // need to set this way instead of using angular two way data bind
                      // data was switching out before the animation was finished
                      element.find('p')[0].innerHTML = scope.data.content.caption; // set caption
                      element.find('img')[0].src = scope.data.content.imageUrl; // set image
                      
                      element.removeClass('ub-' + scope.data.transitions.exit);
                      element.addClass('ub-' + scope.data.transitions.entry);
                      element.attr('style', 'transition-duration:' + scope.data.timing.transitionTime + 'ms');

                      savedData = scope.data;
                  }
                  else if(scope.data != null){
                      $log.debug('about to hide picture, next type on deck: ' + scope.data.type);
                      element.removeClass('ub-' + savedData.transitions.entry);
                      element.addClass('ub-' + savedData.transitions.exit)
                  }
              });
          }
        };
    }
})();