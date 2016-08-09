(function(){
  
  'use strict';

  /**
   * @ngdoc directive
   * @name upBoardApp.directive:ubwNumsWithDelta
   * @description
   * # ubwNumsWithDelta
   */
  angular.module('upBoardApp')
    .directive('ubwNumsWithDelta', ubwNumsWithDelta);
  
    ubwNumsWithDelta.$inject = ['$log'];
    function ubwNumsWithDelta($log) {
      return {
        templateUrl: '/app/frontend/scripts/directives/widgets/ubw-nums-with-delta.tpl.html',
        restrict: 'E',
        replace: true,
        scope: {
          header: '@',
          labels: '@',
          values: '@'
        },
        link: function postLink(scope, element, attrs) {
          
          // extract labels
          var labels = scope.labels.split(',');
          if(labels.length < 3) {
            $log.error('3 label/values expected, aborting');
            return;
          }
          for(var i = 0; i < labels.length; i++){
            scope['label' + i] = labels[i];
          }
          
          function setValues(){
            var values = scope.values.split(',');
            for(var i = 0; i < values.length; i++){
              scope['value' + i] = values[i];
            }
          }
          
          setValues(); // extract values
          
          scope.$watch(function(){ return scope.values }, function(){
            setValues(); // update values when they change
          });
        }
      };
    }

})();