(function(){
    'use strict';

    /**
     * @ngdoc directive
     * @name upBoardApp.directive:ubSms
     * @description
     * # sms
     */
    angular.module('upBoardApp')
      .directive('ubSms', sms);
    
    sms.$inject = ['Auth', 'Ref', '$firebaseObject', '$log', '$filter', '$timeout', 'utility', 'toaster'];
    function sms(Auth, Ref, $firebaseObject, $log, $filter, $timeout, utility, toaster) {
        return {
          templateUrl: '/app/frontend/scripts/directives/ub-sms.tpl.html',
          restrict: 'E',
          replace: true,
          scope:{
              data: '=',
              index: '@'
          },
          link: function(scope, element, attrs){

            var savedData = null; // use to remember for exit transition
            scope.startupTime = new Date().getTime();
            scope.messages = [];
            scope.timestamp = null;

            scope.$watch(attrs.ngShow, function(){

              var isShown = scope.$eval(attrs.ngShow);

              if(isShown){
                $log.debug('about to show ' + scope.data.type);

                element.find('#smsDefaultMessage')[0].innerHTML = scope.data.content.default;
                
                // save active deck id and slide id for bindings
                scope.activeDeckId = scope.data.activeDeckId;
                scope.slideId = scope.data.slideId;
                
                // if last message is expired, clear out messages
                var now = new Date().getTime();
                var messageExpireTime = scope.data.content.timestamp + scope.data.content.timeout;
                if(messageExpireTime < now) scope.messages = [];
                  
                // bind sms slide timestamp to directive scope
                var timestampPath = 'users/' + Auth.$getAuth().uid + '/decks/' + scope.data.activeDeckId + 
                                    '/slides/' + scope.slideId + '/content/timestamp';

                //$log.debug(timestampPath);
                $firebaseObject(Ref.child(timestampPath)).$bindTo(scope, 'timestamp');
                  
                // scroll down for message overflow
                $timeout(function(){
                    angular.element('#smsDisplay').duScrollToElement(angular.element('#smsDisplayEnd'), 0, 500);
                  }, 500);
                
                utility.setEntryTransition(element, scope.data);
                savedData = scope.data;
              }
              else if(savedData !== null){
                $log.debug('about to hide ' + savedData.type + ', next type on deck: ' + scope.data.type);
                utility.setExitTransition(element, savedData);
                savedData = null;
              }
            });
            
            // create watch for new timestamp
            scope.$watch(function(){
              return scope.timestamp != null ? scope.timestamp.$value : null;
            }, function(){

              if(scope.timestamp != null){
                utility.getServerTime().success(function(serverTime){

                  // check if the latest timestamp is at least a second newer than the current server time
                  if((Number(scope.timestamp.$value) + 1000) > serverTime.now){
                    $log.debug('message received!');
                    toaster.pop('success', '', 'Message received!');

                    // get the latest message content
                    var contentPath = 'users/' + Auth.$getAuth().uid + '/decks/' + scope.activeDeckId +
                                      '/slides/' + scope.slideId + '/content';

                    $log.debug(contentPath);

                    var content = $firebaseObject(Ref.child(contentPath));
                    content.$loaded().then(function(){
                      scope.messages.push({body:content.message,timestamp:content.timestamp});

                        // keep scrolling down if messages overflow
                        $timeout(function(){
                          angular.element('#smsDisplay').duScrollToElement(angular.element('#smsDisplayEnd'), 0, 500);
                        }, 500);
                    });
                  }
                });
              }
            });
          }
        }
      }
})();