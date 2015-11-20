'use strict';

/**
 * @ngdoc directive
 * @name upBoardApp.directive:slideshow
 * @description
 * # slideshow
 */
angular.module('upBoardApp')
  .directive('slideshow', ['$compile', function ($compile) {
    return {
      restrict: 'E',
        scope: { data: '=' },
    template: '<p>{{data}}</p>',
      controller: function ( $scope, $element ) {
          
          var slides = '';
          
          console.debug($scope.data);
          
          for(var i = 0; i < $scope.data.length; i++){
              
              var slide = $scope.data[i];
              
              if(slide.type == 'logo'){
                  slides += '<logo></logo>';
              }
              else if(slide.type == 'picture'){
                  slides += '<picture></picture>';
              }
          }
        var el = $compile( slides )( $scope );
        $element.parent().append( el );
    }
    };
  }]);