(function(){
  'use strict';

  /**
   * @ngdoc service
   * @name upBoardApp.ubSocketIo
   * @description
   * # ubSocketIo
   * Factory in the upBoardApp. Uses btford.socket-io to have socket.io as an angular service.
   */
  angular.module('upBoardApp')
    .factory('ubSocketIo', ubSocketIo);

    ubSocketIo.$inject = ['socketFactory'];
    function ubSocketIo(socketFactory) {
      return socketFactory();
    }

})();