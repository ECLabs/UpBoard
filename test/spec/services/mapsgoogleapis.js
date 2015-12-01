'use strict';

describe('Service: mapsGoogleApis', function () {

  // load the service's module
  beforeEach(module('upBoardApp'));

  // instantiate service
  var mapsGoogleApis;
  beforeEach(inject(function (_mapsGoogleApis_) {
    mapsGoogleApis = _mapsGoogleApis_;
  }));

  it('should do something', function () {
    expect(!!mapsGoogleApis).toBe(true);
  });

});
