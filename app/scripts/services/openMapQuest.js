(function(){
    
    'use strict';

    /**
     * @ngdoc service
     * @name upBoardApp.openMapQuest
     * @description
     * # openMapQuest
     * Factory in the upBoardApp.
     */
    angular.module('upBoardApp')
      .factory('openMapQuest', openMapQuest);
    
    
    openMapQuest.$inject = ['$log', '$http'];
    function openMapQuest($log, $http) {

        var zip = null;
    
//        (function init(){
//            if (navigator.geolocation) {
//
//                navigator.geolocation.getCurrentPosition(function(position) {
//
//                    var url = "https://open.mapquestapi.com/nominatim/v1/reverse.php?format=json&callback=JSON_CALLBACK" +                    
//                              "&lat=" + position.coords.latitude + "&lon=" + position.coords.longitude;
//
//                    $http.jsonp(url).then(function(data){
//
//                        $log.debug(data);
//
//                        // set zip 
//                        zip = '111111';
//
//                    }, function(){
//                       $log.error('error retrieving zip code');
//                    });
//
//                }, function(){
//                    $log.error('error retrieving current position');
//                });
//
//              }
//        })();

        return {
          getZip: function(){ return zip; }
        };
    }

})();