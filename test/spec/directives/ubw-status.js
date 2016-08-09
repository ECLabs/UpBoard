'use strict';

describe('Directive: ubwStatus', function () {

  // load the directive's module
  beforeEach(module('upBoardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ubw-status></ubw-status>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ubwStatus directive');
  }));
});
