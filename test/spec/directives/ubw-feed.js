'use strict';

describe('Directive: ubwFeed', function () {

  // load the directive's module
  beforeEach(module('upBoardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ubw-feed></ubw-feed>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ubwFeed directive');
  }));
});
