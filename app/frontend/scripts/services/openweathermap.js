(function(){
    
    'use strict';

    /**
     * @ngdoc service
     * @name upBoardApp.openWeatherMap
     * @description
     * # openWeatherMap
     * Factory in the upBoardApp.
     */
    angular.module('upBoardApp')
      .factory('openWeatherMap', openWeatherMap);

    openWeatherMap.$inject = ['$log', '$http'];
    function openWeatherMap($log, $http) {
        return{
        
            getWeather: function(zip){

                var promise = null;
                
                if(zip != null){
                    var url = 'http://api.openweathermap.org/data/2.5/weather?zip=' + zip +                 
                              ',us&units=imperial&APPID=8cbe87b8668498c44b0ade0ce19afd6b&callback=JSON_CALLBACK'

                    promise = $http.jsonp(url);
                }
                return promise;
            }
        }
    }

    
})();