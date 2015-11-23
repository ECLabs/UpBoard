'use strict';

/**
 * @ngdoc directive
 * @name upBoardApp.directive:bioPanels
 * @description
 * # bioPanels
 */
angular.module('upBoardApp')
  .directive('bioPanels', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the bioPanels directive');
      }
    };
  });