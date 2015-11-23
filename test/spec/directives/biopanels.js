'use strict';

describe('Directive: bioPanels', function () {

  // load the directive's module
  beforeEach(module('upBoardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<bio-panels></bio-panels>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the bioPanels directive');
  }));
});
