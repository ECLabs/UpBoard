'use strict';

/**
 * @ngdoc directive
 * @name upBoardApp.directive:ubwFeed
 * @description
 * # ubwFeed
 */
angular.module('upBoardApp')
  .directive('ubwFeed', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the ubwFeed directive');
      }
    };
  });