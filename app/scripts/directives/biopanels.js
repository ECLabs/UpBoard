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

              scope.count = 0;           // bio content counter
              scope.showContent = false; // use to show/hide bio content
              scope.showLine = false;    // use to show/hide the underline
              
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

                          for(var k = 0; i < contentLength && k < numCols; i++, k++){

                              var col = document.createElement('div');
                              col.setAttribute('class', 'bl-panel col-lg-' + columnSize);

                              var bioBox = document.createElement('div');
                              bioBox.setAttribute('class', 'bl-box');
                              bioBox.setAttribute('style', 'padding:' + (100 / numRows) + '%;');

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
                              bioBox.appendChild(img);
                              bioBox.appendChild(about);

                              // add bio content
//                              var bioContent = document.createElement('div');
//                              bioContent.setAttribute('ng-show', 'showContent' + i);
//                              bioContent.setAttribute('class', 'bl-content');
//                              
//                              var name = document.createElement('h2');
//                              name.innerHTML = content[i].name;
//                              
//                              var bio = document.createElement('p');
//                              bio.innerHTML = content[i].bio;
//                              
//                              var memberBanner = document.createElement('div');
//                              memberBanner.setAttribute('class', 'ecTeamMemberBanner');
//                              memberBanner.innerHTML = 'EC Team Member since';
//                              
//                              var memberDate = document.createElement('div');
//                              memberDate.setAttribute('class', 'ecTeamMemberDate');
//                              memberDate.innerHTML = content[i].hireYear;
//                              
//                              var imgContent = document.createElement('img');
//                              imgContent.setAttribute('class', 'teamMemberFullPhoto');
//                              imgContent.src = content[i].imageUrlContent;
//                              
//                              bioContent.appendChild(name);
//                              bioContent.appendChild(bio);
//                              bioContent.appendChild(memberBanner);
//                              bioContent.appendChild(memberDate);
//                              bioContent.appendChild(imgContent);
                              
                              col.appendChild(bioBox);
//                              col.appendChild(bioContent);
                              
                              
//                              <div id="bioPanels"></div>
//    
//    <div ng-show="showContent" class="bl-content">
//      <div>
//        <h2>
//            <!--bioPanels top left name Injected Here -->
//            {{panel.name}}
//        </h2>
//        <p>
//            <!--bioPanels top left text Injected Here -->
//            {{panel.bio}}
//        </p>
//        <div>
//          <div class="ecTeamMemberBanner">EC Team Member since</div>
//          <div class="ecTeamMemberDate">{{panel.hireYear}}</div>
//        </div>
//      </div>
//      <div class="teamMemberFullPhoto">
//        <img src="{{panel.imageUrlContent}}"/>
//      </div>
//    </div>

                              row.appendChild(col);
                              
                              bioPanels.appendChild(row);
                              
                              // fire transition effects with delays
                                  
                              // show underline in
                              
                              // show bio content
                              $timeout(function(){
                                  
                                  var content = scope.data.content.content;
                                  
                                  var bioContent = element.find('.bl-content')[0];
                                  var name = element.find('.bl-content h2')[0];
                                  var bio = element.find('.bl-content p')[0];
                                  var hireYear = element.find('.bl-content .ecTeamMemberDate')[0];
                                  var imgCover = element.find('.bl-content img')[0];
                                  
                                  // reset
                                  name.innerHTML = '';
                                  bio.innerHTML = '';
                                  hireYear.innerHTML = '';
                                  imgCover.src = '';
                                  
                                  name.innerHTML = content[scope.count].name;
                                  bio.innerHTML = content[scope.count].bio;
                                  hireYear.innerHTML = content[scope.count].hireYear;
                                  imgCover.src = content[scope.count].imageUrlContent;
                                  
                                  var bioPanel = angular.element('#bioPanels')[0];
                                  var name = bioPanel.getElementsByTagName('h2')[scope.count];
                                  
//                                  $log.debug(name.getBoundingClientRect().left);
//                                  $log.debug(name.getBoundingClientRect().top);
//                                  $log.debug(bioContent);
                                  
//                                  element.style.transformOrigin = name.getBoundingClientRect().left + ' ' + name.getBoundingClientRect().top;
//                                  bioContent.style.transformOrigin = name.getBoundingClientRect().left + 'px ' + name.getBoundingClientRect().top + 'px';
                                  
//                                  scope['showContent' + scope.count] = true;
                                  scope.showContent = true;
                              }, timing.transitionTime + timing.openFirstSection + ((timing.openSection + timing.sectionTime) * i));
                              
                              // hide bio content
                              $timeout(function(){
//                                  scope['showContent' + scope.count] = false;
                                  scope.showContent = false;
                                  scope.count++;
                              }, timing.transitionTime + timing.openFirstSection + 
                                  ((timing.openSection + timing.sectionTime) * i) + timing.sectionTime);
                                       
                                       
                              // show underline out
                                       
                              // initial slide open      first section delay
                          }
                          
                          
                      }
                      
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