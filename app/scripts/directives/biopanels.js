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
    
    bioPanels.$inject = ['$log', '$timeout', 'utility'];
    function bioPanels($log, $timeout, utility) {
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
                      
                      
                      
                      // insert data
                      var bioPanels = element.find('#bioPanels')[0];
                      
                      // max columns - 4
                      var content = scope.data.content.content;
                      var contentLength = content.length;
                      var columnConstants = {max: 4, min: 2};
                      var dividedSize = Math.ceil(contentLength / 2);
                      
                      var numCols = dividedSize > columnConstants.max ? columnConstants.max:
                                    dividedSize < columnConstants.min ? columnConstants.min : dividedSize;
                      var columnSize = 12 / numCols;
                      var numRows = Math.ceil(contentLength / numCols);  // dummy array to help out ng-repeat
                      
                                                 
                      for(var i = 0, j = 0; i < contentLength && j < numRows; j++){

                          var row = document.createElement('div');
                          row.setAttribute('class', 'row');

                          for(var k = 0; k < numCols; i++, k++){

                              var col = document.createElement('div');
                              col.setAttribute('class', 'bl-panel col-lg-' + columnSize);

                              var colData = document.createElement('div');
                              colData.setAttribute('class', 'bl-box');
                              colData.setAttribute('style', 'padding:' + (100 / numRows) + '%;');

                              var img = document.createElement('img');
                              img.setAttribute('src', content[i].imageUrlCover);

                              var about = document.createElement('div');
                              about.setAttribute('class', 'bl-icon bl-icon-about');

                              var firstName = document.createElement('h2');
                              firstName.innerHTML = content[i].name.split(' ')[0]; // get first name

                              var underline = document.createElement('div');
                              underline.setAttribute('ng-show', 'showLine');
                              underline.setAttribute('class', 'bioUnderLine');

                              about.appendChild(firstName);
                              about.appendChild(underline);

                              colData.appendChild(img);
                              colData.appendChild(about);

                              col.appendChild(colData);

                              row.appendChild(col);
                          }

                          bioPanels.appendChild(row);
                      }
                      
                      
//                      <div class="row" ng-repeat="row in range(numRows)" >
//        <div ng-repeat="panel in chunk(data.content.content, row * numCols , (row + 1) * numCols)" class="bl-panel col-lg-{{columnSize}}">
//            <div class="bl-box" style="padding:{{100 / numRows}}%">
//                <img src="{{panel.imageUrlCover}}" />
//                <div class="bl-icon bl-icon-about">
//                    <!-- bioPanels top left first name Injected Here -->
//                    <h2>{{panel.name.split(' ')[0]}}</h2>
//                    <div ng-show="showLine" class="bioUnderline"></div>
//                </div>
//            </div>
//        </div>
//    </div>
                      scope.showLine = true;
                      scope.showContent = true;
                      
                      $timeout(function(){
                          scope.showLine = false;
                          scope.showContent = false;
                      }, 5000);
                      
                      
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