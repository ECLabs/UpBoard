'use strict';

describe('Service: openWeatherMap', function () {

  // load the service's module
  beforeEach(module('upBoardApp'));

  // instantiate service
  var openWeatherMap;
  beforeEach(inject(function (_openWeatherMap_) {
    openWeatherMap = _openWeatherMap_;
  }));

  it('should do something', function () {
    expect(!!openWeatherMap).toBe(true);
  });

});
