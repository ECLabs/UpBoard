'use strict';

describe('Directive: ubwRateAndCountWithDelta', function () {

  // load the directive's module
  beforeEach(module('upBoardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ubw-rate-and-count-with-delta></ubw-rate-and-count-with-delta>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ubwRateAndCountWithDelta directive');
  }));
});
