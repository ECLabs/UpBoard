'use strict';

/**
 * @ngdoc directive
 * @name upBoardApp.directive:liveVideoOverlay
 * @description
 * # liveVideoOverlay
 */
angular.module('upBoardApp')
  .directive('liveVideoOverlay', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the liveVideoOverlay directive');
      }
    };
  });