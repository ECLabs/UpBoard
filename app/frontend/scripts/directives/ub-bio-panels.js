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
          templateUrl: '/app/frontend/scripts/directives/ub-bio-panels.tpl.html',
          restrict: 'E',
          replace: true,
          scope: {
              data: '=',
              index: '@',
              paused: '@'
          },
          link: function(scope, element, attrs){

              var columnConstants = {max: 4, min: 2}; // <-- change these if you want different min/max
              var bootstrapMaxColSize = 12; // bootstrap column sizing maxes out at 12

              var savedData; // use to remember for exit transition

              function init(){
                  scope.count = 0;           // bio content counter
                  scope.startTime = null;          // use to track current step when transitioning to show content
                  scope.remainingTimes = {};
                  scope.showContent = false; // use to show/hide bio content
                  scope.timeoutPromises = [];
              }

              function clear(){
              
                  scope['showLine' + scope.count] = false;

                  while(scope.timeoutPromises.length > 0){
                      $timeout.cancel(scope.timeoutPromises.shift());
                  }
              }

              function showBioContent(show){

                  // set transform origin to show, using jQuery for better css() support
                  var currentBioPanel = $(element.find('.bl-panel')[scope.count]);
                  var scrollTop = $(window).scrollTop();
                  var xAxis = currentBioPanel.position().left;
                  var yAxis = currentBioPanel.position().top - scrollTop; // compensate for scroll
                  var bpHeight = currentBioPanel.outerHeight();
                  var bpWidth = currentBioPanel.outerWidth();
                  
                  var bioContent = $(element.find('.bl-content')[0]); 
                  bioContent.css('height', bpHeight + 'px');
                  bioContent.css('width', bpWidth + 'px');
                  bioContent.css('transform-origin', xAxis + 'px ' + yAxis + 'px');
                  
                  var bioPanels = element.find('.bl-panel');
                  if(show){
                      
                      // place content window over current bio panel, hide will start in top left corner
                      bioContent.css('left', xAxis + 'px');
                      bioContent.css('top', yAxis + 'px');
                      
                      // scale down other panels
                      for(var i = 0; i < bioPanels.length; i++){
                          
                          if(i != scope.count){
                              $(bioPanels[i]).css('transform', 'scale(0)');
                              $(bioPanels[i]).css('transition-duration', '0.5s');
                          }
                      }
                      
                      // delay showing inside of content to give some time for transition effect
                      $timeout(function(){$('.bl-content .row').css('opacity', '1')}, 500);
                  }
                  else {
                      // scale up other panels
                      for(var i = 0; i < bioPanels.length; i++){
                          
                          if(i != scope.count){
                              $(bioPanels[i]).css('transform', 'scale(1)');
                              $(bioPanels[i]).css('transition-duration', '0.5s');
                          }
                      }
                      $(element.find('.bl-content .row')[0]).css('opacity', '0');
                  }
              }

              function getTableProps(){

                  var tableProps = {};

                  tableProps.content = scope.data.content.content;
                  tableProps.timing = scope.data.timing;
                  tableProps.contentLength = tableProps.content.length;
                  tableProps.dividedSize = Math.ceil(tableProps.contentLength / 2);

                  tableProps.numCols = tableProps.dividedSize > columnConstants.max ?
                                                                columnConstants.max :
                                       tableProps.dividedSize < columnConstants.min ?
                                                                columnConstants.min :
                                                                tableProps.dividedSize;

                  tableProps.columnSize = bootstrapMaxColSize / tableProps.numCols;
                  tableProps.numRows = Math.ceil(tableProps.contentLength / tableProps.numCols);

                  return tableProps;
              }

              function saveRemainingTimes(){

                  var tableProps = getTableProps();

                  $log.debug('begin saveRemainingTimes')
                  $log.debug(scope.remainingTimes)

                  var timePassed = new Date().getTime() - scope.startTime;
                  var underlineTime = tableProps.timing.openSection / 3;

                  for(var i = 0; i < tableProps.contentLength; i++){

                      var timeToNextPanelShow = tableProps.timing.transitionTime +
                                                tableProps.timing.openFirstSection +
                                                ((tableProps.timing.openSection +
                                                  tableProps.timing.sectionTime) * i);

                      var timeToNextPanelHide = tableProps.timing.transitionTime +
                                                tableProps.timing.openFirstSection +
                                                ((tableProps.timing.openSection +
                                                  tableProps.timing.sectionTime) * i) +
                                                tableProps.timing.sectionTime;

                      // use remaining times if they exist and deduct time passed from them, otherwise use starter values
                      var duration = scope.remainingTimes[i] != null && scope.remainingTimes[i].underlineIn != null ?
                                     scope.remainingTimes[i].underlineIn : timeToNextPanelShow - underlineTime;
                      var underlineInDuration = duration - timePassed;

                      duration = scope.remainingTimes[i] != null && scope.remainingTimes[i].showContent != null ?
                                 scope.remainingTimes[i].showContent : timeToNextPanelShow;
                      var showContentDuration = duration - timePassed;

                      duration = scope.remainingTimes[i] != null && scope.remainingTimes[i].hideContent != null ?
                                 scope.remainingTimes[i].hideContent : timeToNextPanelHide;
                      var hideContentDuration = duration - timePassed;

                      duration = scope.remainingTimes[i] != null && scope.remainingTimes[i].underlineOut != null ?
                                 scope.remainingTimes[i].underlineOut : timeToNextPanelHide + underlineTime;
                      var underlineOutDuration = duration - timePassed;

                      // store remaining times
                      scope.remainingTimes[i] = {underlineIn: underlineInDuration,
                                                 showContent: showContentDuration,
                                                 hideContent: hideContentDuration,
                                                 underlineOut: underlineOutDuration};
                  }

                $log.debug('end saveRemainingTimes')
                $log.debug(scope.remainingTimes);
              }

              function run(){

                  var tableProps = getTableProps();

                  // start transitions where the scope.count was last
                  for(var i = scope.count; i < tableProps.contentLength; i++){

                      // fire transition effects with delays
                      if(scope.remainingTimes[i].underlineIn > 0){

                          // show underline in
                          scope.timeoutPromises.push($timeout(function(){

                              var bioPanelEl = angular.element(element.find('.bl-panel')[scope.count]);
                              $document.duScrollToElement(bioPanelEl, 0, 1000);
                              scope['showLine' + scope.count] = true;

                          }, scope.remainingTimes[i].underlineIn));
                      }

                      if(scope.remainingTimes[i].showContent > 0){

                          // show bio content
                          scope.timeoutPromises.push($timeout(function(){

                              var content = scope.data.content.content;

                              var name = element.find('.bl-content h2')[0];
                              var bio = element.find('.bl-content p')[0];
                              var hireYear = element.find('.bl-content .ecTeamMemberDate')[0];
                              var imgCover = element.find('.bl-content-img')[0];

                              // reset
                              name.innerHTML = '';
                              bio.innerHTML = '';
                              hireYear.innerHTML = '';
                              imgCover.src = '';

                              name.innerHTML = tableProps.content[scope.count].name;
                              bio.innerHTML = tableProps.content[scope.count].bio;
                              hireYear.innerHTML = tableProps.content[scope.count].hireYear;
                              imgCover.setAttribute('style', "background-image:url('" +
                                                    tableProps.content[scope.count].imageUrlContent + "');");

                              showBioContent(true);
                              scope.showContent = true;

                          }, scope.remainingTimes[i].showContent));
                      }

                      if(scope.remainingTimes[i].hideContent > 0){

                          // hide bio content
                          scope.timeoutPromises.push($timeout(function(){

                              showBioContent(false);
                              scope.showContent = false;

                          }, scope.remainingTimes[i].hideContent));
                      }

                      if(scope.remainingTimes[i].underlineOut > 0){

                          // show underline out
                          scope.timeoutPromises.push($timeout(function(){

                              scope['showLine' + scope.count] = false;
                              scope.count++;

                          }, scope.remainingTimes[i].underlineOut));
                      }
                  }
              }

              scope.$watch(attrs.ngShow, function(){

                  var isShown = scope.$eval(attrs.ngShow);

                  if(isShown){
                      $log.debug('about to show ' + scope.data.type);
                      
                      //reset data first
                      var bioPanels = element.find('div')[0];
                      bioPanels.innerHTML = '';

                      // initialize scope variables
                      init();

                      var tableProps = getTableProps();

                      // dynamically build out rows/columns
                      for(var i = 0, j = 0; i < tableProps.contentLength && j < tableProps.numRows; j++){

                          var row = document.createElement('div');
                          row.setAttribute('class', 'row');

                          for(var k = 0; k < tableProps.numCols; i++, k++){

                              if(i < tableProps.contentLength){
                                  
                                  var col = document.createElement('div');
                                  col.setAttribute('class', 'bl-panel col-lg-' + tableProps.columnSize);

                                  var bioBox = document.createElement('div');
                                  bioBox.setAttribute('class', 'bl-box');
                                  bioBox.setAttribute('style', 'padding-top:' + (100 / tableProps.numRows) +
                                                      "vh;background-image:url('" + tableProps.content[i].imageUrlCover + "')");
                                  bioBox.innerHTML = '&nbsp;'; // need some content, everything else is absolute
                                  
                                  var filter = document.createElement('div');
                                  filter.setAttribute('class', 'bl-box-filter');
                                  filter.innerHTML = '&nbsp;';

                                  var about = document.createElement('div');
                                  about.setAttribute('class', 'bl-icon bl-icon-about');

                                  var firstName = document.createElement('h2');
                                  firstName.innerHTML = tableProps.content[i].name.split(' ')[0]; // get first name

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
                              }
                              else{
                                  // add blank columns to fill space
                                  var col = document.createElement('div');
                                  col.setAttribute('class', 'bl-panel col-lg-' + tableProps.columnSize);

                                  var bioBox = document.createElement('div');
                                  bioBox.setAttribute('class', 'bl-box');
                                  bioBox.setAttribute('style', 'padding-top:' + (100 / tableProps.numRows) + 'vh;');
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

                      if(scope.paused === 'false') {
                        $log.debug('initial start');
                        scope.startTime = new Date().getTime();
                        saveRemainingTimes();
                        run();
                      }
                  }
                  else if(savedData != null){

                      clear();
                      $log.debug('about to hide ' + savedData.type + ', next type on deck: ' + scope.data.type);
                      utility.setExitTransition(element, savedData);
                      savedData = null;
                  }
              });

              scope.$watch(function(){ return attrs.ngShow && scope.paused }, function(){

                  if(scope.data != null && scope.data.type === 'bioPanels') {

                      if(scope.paused === 'true'){
                          $log.debug('slideshow was paused!');

                          while(scope.timeoutPromises.length > 0){
                              $timeout.cancel(scope.timeoutPromises.shift());
                          }

                          // slideshow was started, need to save remaining times
                          if(scope.startTime != null) saveRemainingTimes();
                      }
                      else if(scope.timeoutPromises.length === 0 && scope.paused === 'false'){

                          $log.debug('slideshow was started!');

                          // no remaining times have been saved, need to initialize
                          if(Object.keys(scope.remainingTimes).length === 0) {
                              scope.startTime = new Date().getTime();
                              saveRemainingTimes();
                          }
                          else {
                              // remaining times have been set already, adjust start time for next pause
                              scope.startTime = new Date().getTime();
                          }
                          run(); // continue slideshow
                      }
                  }
              });
          }
        };
      }
})();