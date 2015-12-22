(function(){
    'use strict';

    /**
     * @ngdoc directive
     * @name upBoardApp.directive:ubSms
     * @description
     * # logo
     */
    angular.module('upBoardApp')
      .directive('ubSms', logo);
    
    logo.$inject = ['Auth', 'Ref', '$firebaseObject', '$log', '$filter', '$timeout', 'utility', 'toaster'];
    function logo(Auth, Ref, $firebaseObject, $log, $filter, $timeout, utility, toaster) {
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

            scope.$watch(attrs.ngShow, function(){

              var isShown = scope.$eval(attrs.ngShow);

              if(isShown){
                $log.debug('about to show ' + scope.data.type);

                //reset data first
                element.find('#smsDefaultMessage')[0].innerHTML = '';

                element.find('#smsDefaultMessage')[0].innerHTML = scope.data.content.default;
                
                // save active deck id and slide id for bindings, generate unique messages array and timestamp ids
                scope.activeDeckId = scope.data.activeDeckId;
                scope.slideId = scope.data.slideId;
                scope.messagesId = 'messages_' + scope.activeDeckId + '_' + scope.slideId;
                scope.timestampId = 'timestamp_' + scope.activeDeckId + '_' + scope.slideId;

                // if last message is expired, clear out messages
                var now = new Date().getTime();
                var messageExpireTime = scope.data.content.timestamp + scope.data.content.timeout;
                if(messageExpireTime < now){
                  scope[scope.messagesId]  = [];
                }
                scope.messages = utility.cloneArray(scope[scope.messagesId]);

                // bind sms slide timestamp to directive scope
                var timestampPath = 'users/' + Auth.$getAuth().uid + '/decks/' + scope.data.activeDeckId + 
                                    '/slides/' + scope.data.slideId + '/content/timestamp';
                
                $firebaseObject(Ref.child(timestampPath)).$bindTo(scope, scope.timestampId);

                // watch for new messages
                scope.$watch(function(scope){return scope[scope.timestampId];}, function(){
                  utility.getServerTime().success(function(serverTime){
                    if((Number(scope[scope.timestampId].$value) + 1000) > serverTime.now){
                      $log.debug('message received!');
                      toaster.pop('success', '', 'Message received!');

                      // get the latest message content
                      var contentPath = 'users/' + Auth.$getAuth().uid + '/decks/' + scope.activeDeckId +
                                        '/slides/' + scope.slideId + '/content';

                      var content = $firebaseObject(Ref.child(contentPath));
                      content.$loaded().then(function(){
                        scope[scope.messagesId].push({body:content.message,timestamp:content.timestamp});
                        scope.messages = utility.cloneArray(scope[scope.messagesId]);

                        // keep scrolling down if messages overflow
                        $timeout(function(){
                          angular.element('#smsDisplay').duScrollToElement(angular.element('#smsDisplayEnd'), 0, 500);
                        }, 500);
                      });
                    }
                  });
                });

                // keep scrolling down if messages overflow
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
          }
        };
    }
})();