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
              data: '='
          },
          link: function(scope, element, attrs){

            var savedData = null; // use to remember for exit transition
            scope.startupTime = new Date().getTime();
            scope.messages = [];
            scope.timestampsToWatch = []; // tracks timestamps to watch
            scope.timestampWatchers = []; // tracks watchers added for above timestamps

            scope.$watch(attrs.ngShow, function(){

              var isShown = scope.$eval(attrs.ngShow);

              if(isShown){
                $log.debug('about to show ' + scope.data.type);

                //reset data first
                element.find('#smsDefaultMessage')[0].innerHTML = '';

                element.find('#smsDefaultMessage')[0].innerHTML = scope.data.content.default;
                
                // save active deck id and slide id for bindings, generate unique messages array id and timestamp id
                scope.activeDeckId = scope.data.activeDeckId;
                scope.slideId = scope.data.slideId;
                scope.messagesId = 'messages_' + scope.activeDeckId + '_' + scope.slideId;
                scope.timestampId = 'timestamp_' + scope.activeDeckId + '_' + scope.slideId;
                
                // if last message is expired, clear out messages
                var now = new Date().getTime();
                var messageExpireTime = scope.data.content.timestamp + scope.data.content.timeout;
                if(messageExpireTime < now){
                  scope[scope.messagesId] = [];
                }
                scope.messages = utility.cloneArray(scope[scope.messagesId]);

                // add timestamp to watch only once per sms slide
                if(scope.timestampsToWatch.indexOf(scope.timestampId) === -1){
                  
                  // bind sms slide timestamp to directive scope
                  var timestampPath = 'users/' + Auth.$getAuth().uid + '/decks/' + scope.data.activeDeckId + 
                                      '/slides/' + scope.slideId + '/content/timestamp';

                  //$log.debug(timestampPath);
                  $firebaseObject(Ref.child(timestampPath)).$bindTo(scope, scope.timestampId);
                  
                  $log.debug('adding timestamp to watch: ' + scope.timestampId);
                  scope.timestampsToWatch.push(scope.timestampId);
                }

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
            
            // watch timestampsToWatch array for changes to know when to add another timestamp watcher
            scope.$watch(function(){return scope.timestampsToWatch.join(',');}, function(){
              
              for(var i = 0; i < scope.timestampsToWatch.length; i++){
                
                var timestampId = scope.timestampsToWatch[i];
                if(scope.timestampWatchers.indexOf(timestampId) == -1){
                  $log.debug('new timestamp to watch came in: ' + timestampId);    
                 
                  // create watch for new timestamp
                  scope.$watch(function(){return scope[timestampId];}, function(){
                    
                    $log.debug(timestampId);
                    //$log.debug('timestamp changed:' + scope[timestampId].$value);
                    
                    utility.getServerTime().success(function(serverTime){
                      
                      // check if the latest timestamp is at least a second newer than the current server time
                      if((Number(scope[timestampId].$value) + 1000) > serverTime.now){
                        $log.debug('message received!');
                        toaster.pop('success', '', 'Message received!');

                        // pull the deck id and slide id from the affected timestampId
                        var timestampIdArr = timestampId.split('_');
                        var deckId = timestampIdArr[1];
                        var slideId = timestampIdArr[2];
                        var messagesId = 'messages_' + deckId + '_' + slideId;
                        
                        // get the latest message content
                        var contentPath = 'users/' + Auth.$getAuth().uid + '/decks/' + deckId +
                                          '/slides/' + slideId + '/content';
                        
                        $log.debug(contentPath);

                        var content = $firebaseObject(Ref.child(contentPath));
                        content.$loaded().then(function(){
                          if(scope[messagesId] == null) scope[messagesId] = [];
                          scope[messagesId].push({body:content.message,timestamp:content.timestamp});
                          
                          // if current slide is in view, update scope.messages immediately
                          if(scope.slideId == slideId){
                            
                            $log.debug('sms slide being updated is in view, update now');
                            scope.messages = utility.cloneArray(scope[messagesId]);
                            
                            // keep scrolling down if messages overflow
                            $timeout(function(){
                              angular.element('#smsDisplay').duScrollToElement(angular.element('#smsDisplayEnd'), 0, 500);
                            }, 500);
                          } 
                        });
                      }
                    });
                  });
                  
                  scope.timestampWatchers.push(timestampId);
                }
              }
            });
          }
        };
    }
})();