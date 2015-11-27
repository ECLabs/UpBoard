'use strict';

describe('Directive: liveVideoOverlay', function () {

  // load the directive's module
  beforeEach(module('upBoardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<live-video-overlay></live-video-overlay>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the liveVideoOverlay directive');
  }));
});
