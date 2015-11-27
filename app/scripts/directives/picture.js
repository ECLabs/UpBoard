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
    
    picture.$inject = ['$log', 'utility'];
    function picture($log, utility) {
        return {
          templateUrl: 'scripts/directives/picture.tpl.html',
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
                      
                      //reset data first    
                      element.find('p')[0].innerHTML = ''
                      element.find('img')[0].src = '';
                      
                      // need to set this way instead of using angular two way data bind
                      // data was switching out before the animation was finished
                      element.find('p')[0].innerHTML = scope.data.content.caption; // set caption
                      element.find('img')[0].src = scope.data.content.imageUrl; // set image
                      
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