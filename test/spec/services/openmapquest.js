'use strict';

describe('Service: openMapQuest', function () {

  // load the service's module
  beforeEach(module('upBoardApp'));

  // instantiate service
  var openMapQuest;
  beforeEach(inject(function (_openMapQuest_) {
    openMapQuest = _openMapQuest_;
  }));

  it('should do something', function () {
    expect(!!openMapQuest).toBe(true);
  });

});
