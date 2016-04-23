(function(){
  
  'use strict';

  /**
   * @ngdoc directive
   * @name upBoardApp.directive:
   * @description
   * # ubwMap
   */
  angular.module('upBoardApp')
    .controller('UbMapController', UbMapController)
    .directive('ubwMap', ubwMap);
  
    UbMapController.$inject = ['$scope'];
    function UbMapController($scope){
      
      angular.extend($scope, {
        center: {
          lat: 48.8566,
          lng: 2.3522,
          zoom: 13
        },
        defaults: {
          zoomControlPosition: 'bottomleft'
        },
        markers: {
          m1: {
            lat: 48.86,
            lng: 2.34
          },
          m2: {
            lat: 48.85,
            lng: 2.36,
          },
          m3: {
            lat: 48.86,
            lng: 2.37
          },
          m4: {
            lat: 48.84,
            lng: 2.32
          }
        }
        
//        layers: {
//          baselayers: {
//           darkgray: {
//                      name: "DarkGray",
//            type: "agsBase",
//            layer: "DarkGray",
//            visible: false
//           }
//          },
//          overlays: {
//            canvas: {
//              name: "Reference Labels",
//              type: "agsDynamic",
//              url: "http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer",
//              visible: true,
//                layerOptions: {
//                  layers: [0],
//                  opacity: 0.9,
//                  attribution: "Copyright:© 2014 Esri, FAO, NOAA"
//                }
//            }
//          }
//          
//        }
      });
    }
  
    ubwMap.$inject = ['$log', '$timeout', 'leafletData', 'ubSocketIo'];
    function ubwMap($log, $timeout, leafletData, ubSocketIo) {
      return {
        templateUrl: '/app/frontend/scripts/directives/widgets/ubw-map.tpl.html',
        restrict: 'E',
        replace: true,
        scope:{
          header: '@',
//          center: '@',
//          markers: '@',
          event: '@'
        },
        controller: UbMapController,
        controllerAs: 'vm',
        link: function postLink(scope, element, attrs) {

          leafletData.getMap('myMap').then(function(map){

            // GitHub Issue #3002 - this is the workaround to get 
            // the map to size appropriately on load
            $timeout(function(){ map.invalidateSize(); }, 250);
              
          });
          
          var markers = [];
          
          ubSocketIo.on(scope.event, function(data){
            $log.debug(data);
            scope.center = data.center;
            
            if(data.markers != null){
              
              for(var i = 0; i < data.markers.length; i++){
                markers.push(data.markers[i]);
                
                // restrict to no more than 30 markers
                if(markers.length > 30) markers.shift();
              }
              scope.markers = markers;
            }
          });
        }
      };
  }
})();