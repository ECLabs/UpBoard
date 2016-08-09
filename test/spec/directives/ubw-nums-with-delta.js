'use strict';

describe('Directive: ubwNumsWithDelta', function () {

  // load the directive's module
  beforeEach(module('upBoardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ubw-nums-with-delta></ubw-nums-with-delta>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ubwNumsWithDelta directive');
  }));
});
