'use strict';

describe('Directive: ubwIconLabelValue', function () {

  // load the directive's module
  beforeEach(module('upBoardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ubw-icon-label-value></ubw-icon-label-value>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ubwIconLabelValue directive');
  }));
});
