'use strict';

describe('Directive: ubDropIn', function () {

  // load the directive's module
  beforeEach(module('upBoardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ub-drop-in></ub-drop-in>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ubDropIn directive');
  }));
});
