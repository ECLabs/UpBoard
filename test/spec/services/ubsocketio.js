'use strict';

describe('Service: ubSocketIo', function () {

  // load the service's module
  beforeEach(module('upBoardApp'));

  // instantiate service
  var ubSocketIo;
  beforeEach(inject(function (_ubSocketIo_) {
    ubSocketIo = _ubSocketIo_;
  }));

  it('should do something', function () {
    expect(!!ubSocketIo).toBe(true);
  });

});
