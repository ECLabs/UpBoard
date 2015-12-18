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
                
                // if last message is expired, clear out messages
                var now = new Date().getTime();
                var messageExpireTime = scope.data.content.timestamp + scope.data.content.timeout;
                if(messageExpireTime < now){
                  scope.messages = [];
                }

                // bind sms slide timestamp to directive scope
                var timestampPath = 'users/' + Auth.$getAuth().uid + '/decks/' + scope.data.activeDeckId + 
                                    '/slides/' + scope.data.slideId + '/content/timestamp';
                
                scope.timestamp = $firebaseObject(Ref.child(timestampPath));
                
                // save active deck id and slide id for future bindings
                scope.activeDeckId = scope.data.activeDeckId;
                scope.slideId = scope.data.slideId;

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
            
            // watch for new message
            scope.$watch(function(){return attrs.timestamp;}, function(){
              
              if((Number(attrs.timestamp) + 1000) > new Date().getTime()){
                $log.debug('message received!');
                toaster.pop('success', '', 'Message received!');
                
                // get the latest message content
                var contentPath = 'users/' + Auth.$getAuth().uid + '/decks/' + scope.activeDeckId + 
                                  '/slides/' + scope.slideId + '/content';
                
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
        };
    }
})();