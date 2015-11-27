'use strict';

/**
 * @ngdoc filter
 * @name upBoardApp.filter:startFrom
 * @function
 * @description
 * # startFrom
 * Filter in the upBoardApp.
 */
angular.module('upBoardApp')
  .filter('startFrom', function () {
    return function(input, start) {
        if(input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
  });