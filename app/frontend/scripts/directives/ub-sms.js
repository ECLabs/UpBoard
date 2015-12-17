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
    
    logo.$inject = ['$log', '$filter', 'utility'];
    function logo($log, $filter, utility) {
        return {
          templateUrl: '/app/frontend/scripts/directives/ub-sms.tpl.html',
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
                  element.find('#smsMessage')[0].innerHTML = '';
                  element.find('#smsTimestamp')[0].innerHTML = '';

                  // if message is expired, set default message instead
                  var now = new Date().getTime();
                  var messageExpireTime = scope.data.content.timestamp + scope.data.content.timeout;
                  if(messageExpireTime > now) {
                    element.find('#smsMessage')[0].innerHTML = scope.data.content.message;
                    element.find('#smsTimestamp')[0].innerHTML = $filter('date')(new Date(scope.data.content.timestamp), 'shortTime');
                  }
                  else element.find('#smsMessage')[0].innerHTML = scope.data.content.default;

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