(function(){
    'use strict';

    /**
     * @ngdoc directive
     * @name upBoardApp.directive:logo
     * @description
     * # logo
     */
    angular.module('upBoardApp')
      .directive('logo', logo);
    
    logo.$inject = ['$log'];
    function logo($log) {
        return {
          templateUrl: '/scripts/directives/logo.tpl.html',
          restrict: 'E',
          replace: true,
          scope:{
              data: "="
          },
          link: function(scope, element, attrs){

              var savedData; // use to remember for exit transition

              scope.$watch(attrs.ngShow, function(){

                  var isShown = scope.$eval(attrs.ngShow);
    //              $log.debug('something changed w/logo, ngShow eval: ' + isShown);
    //              $log.debug(attrs);
    //              $log.debug(element);

                  if(isShown){
                      $log.debug('about to show logo');
                      //$log.debug(scope.data);
    //                  $log.debug(element.attr('style'));
    //                  element.attr('style', 'background:red;');
    //                  $log.debug(element.attr('style'));

                      element.removeClass('ub-' + scope.data.transitions.exit);
                      element.addClass('ub-' + scope.data.transitions.entry);
                      element.attr('style', 'transition-duration:' + scope.data.timing.transitionTime + 'ms');

                      savedData = scope.data;
    //                  ng-class="data.type === 'logo' ? 'ub-' + data.transitions.entry: 'ub-' + data.transitions.exit" ng-style="{'transition-duration': data.type === 'logo' ? data.timing.transitionTime + 'ms' : null}"
                  }
                  else if(scope.data != null){
                      $log.debug('about to hide logo, next type on deck: ' + scope.data.type);
    //                  $log.debug(scope.data);
    //                  $log.debug(savedData);
                      element.removeClass('ub-' + savedData.transitions.entry);
                      element.addClass('ub-' + savedData.transitions.exit);
                  }
              });
          }
        };
    }
})();