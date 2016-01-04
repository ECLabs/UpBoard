(function(){
    
    'use strict';

    var API_KEY = 'AIzaSyDQHxTwNKRRHCdpH4j7J7kuMhiVWb87UhE';
    var savedAddressComponents = null;
    var savedPostalCode = null;
    var postalCodeType = 'postal_code';
    
    /**
     * @ngdoc service
     * @name upBoardApp.mapsGoogleApis
     * @description
     * # mapsGoogleApis
     * Factory in the upBoardApp.
     */
    angular.module('upBoardApp')
      .factory('mapsGoogleApis', mapsGoogleApis);
    
    mapsGoogleApis.$inject = ['$log', '$http', 'utility'];
    function mapsGoogleApis($log, $http, utility) {

        return {
          getPostalCode: function(callback) {
              
              if(savedPostalCode != null) callback(savedPostalCode);
              
              if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(currentPositionSuccess, currentPositionError);
              }
              
              function currentPositionSuccess(position) {

                var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + 
                            position.coords.latitude + ',' + position.coords.longitude + 
                            '&key=' + API_KEY;

                $http.get(url).success(function(data){
                    savedAddressComponents = data.results[0].address_components;
                    savedPostalCode = utility.extractFromAddress(savedAddressComponents, postalCodeType);
                    callback(savedPostalCode);
                });
              }
              
              function currentPositionError(){
                  $log.error('Unable to retrieve current position');
              }
          }
        };
    }
    
})();