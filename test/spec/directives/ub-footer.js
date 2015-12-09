'use strict';

describe('Directive: ubFooter', function () {

  // load the directive's module
  beforeEach(module('upBoardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ub-footer></ub-footer>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ubFooter directive');
  }));
});
