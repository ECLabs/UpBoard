(function(){
    
    'use strict';

    /**
     * @ngdoc directive
     * @name upBoardApp.directive:bioPanels
     * @description
     * # bioPanels
     */
    angular.module('upBoardApp')
      .directive('bioPanels', bioPanels);
    
    bioPanels.$inject = ['$log', 'utility'];
    function bioPanels($log, utility) {
        return {
          templateUrl: '/scripts/directives/biopanels.tpl.html',
          restrict: 'E',
          replace: true,
          scope: {
              data: '='
          },
          link: function(scope, element, attrs){

              var savedData; // use to remember for exit transition

              scope.range = function(count){
                
                  var rows = [];
                  
                  for(var i = 0; i < count; i++){
                      rows.push(i);
                  }
                  return rows;
              };
              
              scope.chunk = function(data, start, end){
                  return data != null ? data.slice(start, end) : null;
              }
              
              scope.$watch(attrs.ngShow, function(){

                  var isShown = scope.$eval(attrs.ngShow);

                  if(isShown){
                      $log.debug('about to show ' + scope.data.type);
                      
                      // TODO convert to populate data from here instead of in page
                      
                      // max columns - 4
                      var contentLength = scope.data.content.content.length;
                      var columnConstants = {max: 4, min: 2};
                      var dividedSize = Math.ceil(contentLength / 2);
                      
                      scope.numCols = dividedSize > columnConstants.max ? columnConstants.max:
                                      dividedSize < columnConstants.min ? columnConstants.min : dividedSize;
                      scope.columnSize = 12 / scope.numCols;
                      scope.numRows = Math.ceil(contentLength / scope.numCols);  // dummy array to help out ng-repeat
                      
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


//<div class="bl-content">
//  <div>
//    <h2>
//        <!--bioPanels top left name Injected Here -->
//        {{panel.name}}
//    </h2>
//    <p>
//        <!--bioPanels top left text Injected Here -->
//        {{panel.bio}}
//    </p>
//    <div>
//      <div class="ecTeamMemberBanner">EC Team Member since</div>
//      <div class="ecTeamMemberDate">{{panel.hireYear}}</div>
//    </div>
//  </div>
//  <div class="teamMemberFullPhoto">
//    <img src="{{panel.imageUrlContent}}"/>
//  </div>
//</div>