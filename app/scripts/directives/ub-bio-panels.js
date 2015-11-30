(function(){
    
    'use strict';

    /**
     * @ngdoc directive
     * @name upBoardApp.directive:ubBioPanels
     * @description
     * # bioPanels
     */
    angular.module('upBoardApp')
      .directive('ubBioPanels', bioPanels);
    
    bioPanels.$inject = ['$log', '$timeout', '$compile', '$document', 'utility'];
    function bioPanels($log, $timeout, $compile, $document, utility) {
        return {
          templateUrl: 'scripts/directives/ub-bio-panels.tpl.html',
          restrict: 'E',
          replace: true,
          scope: {
              data: '='
          },
          link: function(scope, element, attrs){

              var savedData; // use to remember for exit transition

              scope.count = 0;           // bio content counter
              scope.showContent = false; // use to show/hide bio content
              
              
              
              scope.$watch(attrs.ngShow, function(){

                  var isShown = scope.$eval(attrs.ngShow);

                  if(isShown){
                      $log.debug('about to show ' + scope.data.type);
                      
                      var bioPanels = element.find('#bioPanels')[0];
                      
                      // reset data
                      scope.count = 0;
                      bioPanels.innerHTML = '';
                      
                      var content = scope.data.content.content;
                      var timing = scope.data.timing;
                      
                      var contentLength = content.length;
                      var columnConstants = {max: 4, min: 2}; // <-- change these if you want different min/max
                      var dividedSize = Math.ceil(contentLength / 2);
                      
                      var numCols = dividedSize > columnConstants.max ? columnConstants.max:
                                    dividedSize < columnConstants.min ? columnConstants.min : dividedSize;
                      
                      var bootstrapMaxColSize = 12; // bootstrap column sizing maxes out at 12
                      var columnSize = bootstrapMaxColSize / numCols; 
                      
                      var numRows = Math.ceil(contentLength / numCols);
                      
                      // dynamically build out rows/columns
                      for(var i = 0, j = 0; i < contentLength && j < numRows; j++){

                          var row = document.createElement('div');
                          row.setAttribute('class', 'row');

                          for(var k = 0; k < numCols; i++, k++){

                              if(i < contentLength){
                                  
                                  var col = document.createElement('div');
                                  col.setAttribute('class', 'bl-panel col-lg-' + columnSize);
                                  col.setAttribute('id', 'bioPanel' + i);

                                  var bioBox = document.createElement('div');
                                  bioBox.setAttribute('class', 'bl-box');
                                  bioBox.setAttribute('style', 'padding-top:' + (100 / numRows) + 
                                                      "vh;background-image:url('" + content[i].imageUrlCover + "')");
                                  bioBox.innerHTML = '&nbsp;'; // need some content, everything else is absolute
                                  
                                  var filter = document.createElement('div');
                                  filter.setAttribute('class', 'bl-box-filter');
                                  filter.innerHTML = '&nbsp;';

                                  var about = document.createElement('div');
                                  about.setAttribute('class', 'bl-icon bl-icon-about');

                                  var firstName = document.createElement('h2');
                                  firstName.innerHTML = content[i].name.split(' ')[0]; // get first name

                                  // dynamically sized based on name length
                                  var underline = document.createElement('div');
                                  underline.setAttribute('ng-show', 'showLine' + i); // dynamic binding
                                  underline.setAttribute('class', 'bioUnderline');
                                  underline.setAttribute('style', 'width:' + (firstName.innerHTML.length * 1.4) + 'em'); 

                                  about.appendChild(firstName);
                                  about.appendChild(underline);
                                  bioBox.appendChild(filter);
                                  bioBox.appendChild(about);

                                  col.appendChild(bioBox);
                                  row.appendChild(col);
                                  bioPanels.appendChild(row);

                                  // fire transition effects with delays
                                  var timeToNextPanelShow = timing.transitionTime + timing.openFirstSection + 
                                                            ((timing.openSection + timing.sectionTime) * i);

                                  var timeToNextPanelHide = timing.transitionTime + timing.openFirstSection + 
                                                            ((timing.openSection + timing.sectionTime) * i) + 
                                                            timing.sectionTime;

                                  // show underline in
                                  $timeout(function(){
                                      $document.duScrollToElement(angular.element('#bioPanel' + scope.count), 0, 1000);
                                      scope['showLine' + scope.count] = true;
                                  }, timeToNextPanelShow - 1000);

                                  // show bio content
                                  $timeout(function(){

                                      var content = scope.data.content.content;

                                      var bioContent = element.find('.bl-content')[0];
                                      var name = element.find('.bl-content h2')[0];
                                      var bio = element.find('.bl-content p')[0];
                                      var hireYear = element.find('.bl-content .ecTeamMemberDate')[0];
                                      var imgCover = element.find('.bl-content-img')[0];

                                      // reset
                                      name.innerHTML = '';
                                      bio.innerHTML = '';
                                      hireYear.innerHTML = '';
                                      imgCover.src = '';

                                      name.innerHTML = content[scope.count].name;
                                      bio.innerHTML = content[scope.count].bio;
                                      hireYear.innerHTML = content[scope.count].hireYear;
                                      imgCover.setAttribute('style', "background-image:url('" + content[scope.count].imageUrlContent + "');");

                                      scope.showContent = true;
                                  }, timeToNextPanelShow);

                                  // hide bio content
                                  $timeout(function(){
                                      scope.showContent = false;
                                  }, timeToNextPanelHide);

                                  // show underline out
                                  $timeout(function(){
                                      scope['showLine' + scope.count] = false;
                                      scope.count++;
                                  }, timeToNextPanelHide + 1000);
                              }
                              else{
                                  // add blank columns to fill space
                                  var col = document.createElement('div');
                                  col.setAttribute('class', 'bl-panel col-lg-' + columnSize);

                                  var bioBox = document.createElement('div');
                                  bioBox.setAttribute('class', 'bl-box');
                                  bioBox.setAttribute('style', 'padding-top:' + (100 / numRows) + 'vh;');
                                  bioBox.innerHTML = '&nbsp;';
                                  
                                  var filter = document.createElement('div');
                                  filter.setAttribute('class', 'bl-box-filter');
                                  filter.innerHTML = '&nbsp;';
                                  
                                  bioBox.appendChild(filter);
                                  col.appendChild(bioBox);
                                  row.appendChild(col);
                                  bioPanels.appendChild(row);
                              }
                          }
                      }
                      
                      $compile(element.contents())(scope); // compile for angular to pick up new bindings
                      
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