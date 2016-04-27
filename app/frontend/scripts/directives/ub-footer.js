(function(){
    
    'use strict';

    /**
     * @ngdoc directive
     * @name upBoardApp.directive:ubFooter
     * @description
     * # footer
     */
    angular.module('upBoardApp')
      .directive('ubFooter', footer);
    
    footer.$inject = ['$compile', '$log', '$http', '$interval', '$templateCache', 'mapsGoogleApis', 'openWeatherMap'];
    function footer($compile, $log, $http, $interval, $templateCache, mapsGoogleApis, openWeatherMap) {
        return {
          templateUrl: '/app/frontend/scripts/directives/ub-footer.tpl.html',
          restrict: 'E',
          replace: true,
          scope: {
              data: '=',
              logo: '=',
              type: '@'
          },
          link: function postLink(scope, element, attrs) {
              
              // update the weather
              function updateWeather(){
                  if(scope.zip != null){
                      openWeatherMap.getWeather(scope.zip).success(function(data){
                          scope.weather = Math.floor(data.main.temp) + ' ºF ' + data.weather[0].main;
                      });
                  }
              }
              
              // set zip with callback function
              function setZip(postalCode){
                  //$log.debug(postalCode);
                  scope.zip = postalCode;
                  updateWeather();
              };
              
              mapsGoogleApis.getPostalCode(setZip);
              
              // set clock
              function tick() { scope.clock = Date.now(); }
              tick();
              
              $interval(tick, 1000); // update the clock every second
              $interval(updateWeather, 60000); // update weather every minute
              
              // update footer content each time slide changes
              scope.$watch(function(){return scope.data != null ? scope.data.slideId : null}, function(){
                 
                  if(scope.data != null && scope.data.content != null){

                    // need to clear out if caption is null
                    scope.caption = scope.data.content.caption != null ? scope.data.content.caption : null;
                    
                    $log.debug(scope.type)
                    
                    var contentUrl = '/app/frontend/scripts/directives/ub-footer.partial.tpl.html';
                    
                    if(scope.type != null && scope.type != '') contentUrl = '/app/frontend/scripts/directives/ub-footer.partial.' + scope.type + '.tpl.html';
                    
                    var contentHtml = $templateCache.get(contentUrl);
                    var footerContents = element.find('.ub-footer-content')[0];
                    
                    if(contentHtml != null){
                      angular.element(footerContents).html($compile(contentHtml)(scope));
                    }
                    else {
                      $http.get(contentUrl).then(function(response){

                        $log.debug(response)
                        
                        angular.element(footerContents).html($compile(response.data)(scope));
                        $templateCache.put(contentUrl, response.data);
                      })
                    }
                  }
              });
            
            // temporary function to kick of eaton feed
            scope.startEaton = function(){
              $log.debug('this is a test');
              
              $http.get('https://httpbin.org/get').then(function(response){
                $log.debug(response);
              });
            }
            
            scope.getContent = function(){
              return "'/app/frontend/scripts/directives/ub-footer.partial." + (scope.type != null && scope.type != '' ? scope.type + '.' : '') + "tpl.html'"
            }
          }
        };
      }
    
})();