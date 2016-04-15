(function(){
  
  'use strict';

  /**
   * @ngdoc directive
   * @name upBoardApp.directive:
   * @description
   * # ubwMap
   */
  angular.module('upBoardApp')
    .directive('ubwMap', ubwMap);
  
  ubwMap.$inject = ['$log', '$timeout', 'leafletData'];
  function ubwMap($log, $timeout, leafletData) {
    return {
      templateUrl: '/app/frontend/scripts/directives/widgets/ubw-map.tpl.html',
      restrict: 'E',
      replace: true,
      scope:{
        header: '@'
      },
      link: function postLink(scope, element, attrs) {
        
//        angular.extend(scope, {
//            center: {
//                lat: 51.505,
//                lng: -0.09,
//                zoom: 8
//            }
//        });
        
//        $log.debug(leafletData.getMap())
        
        leafletData.getMap().then(function(map){
          $log.debug(map)
          $timeout(function(){map.invalidateSize();}, 1000);
        });
//        $log.debug(angular.element('#mymap'));
        
//        $timeout(function(){
//          angular.element('#mymap').map()invalidateSize();
//        }, 1000);
        
        
        
      }
    };
  }
})();