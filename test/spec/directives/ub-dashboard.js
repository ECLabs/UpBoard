'use strict';

describe('Directive: ubDashboard', function () {

  // load the directive's module
  beforeEach(module('upBoardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ub-dashboard></ub-dashboard>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ubDashboard directive');
  }));
});
