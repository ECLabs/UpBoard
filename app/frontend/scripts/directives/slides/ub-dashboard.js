(function(){
  
  'use strict';

  /**
   * @ngdoc directive
   * @name upBoardApp.directive:ubDashboard
   * @description
   * # dashboard
   */
  angular.module('upBoardApp')
    .directive('ubDashboard', ubDashboard);
  
  ubDashboard.$inject = ['$log', '$timeout', 'highchartsNG'];
  function ubDashboard($log, $timeout, highchartsNG) {
    return {
      templateUrl: '/app/frontend/scripts/directives/slides/ub-dashboard.bootstrap.tpl.html',
      restrict: 'E',
      replace: true,
      scope:{
        data: '=',
        index: '@'
      },
      controller: ['$scope', function($scope){
        
        $scope.twitterIngestRateSeries = [{name:'', data:[50,130,68,91,150,75,103], id:'series-0'}];
          
        $scope.twitterIngestRateConfig = {
            options: {
              chart: {
                backgroundColor: null,
                borderWidth: 0,
                type: 'line',
                margin: [2, 0, 2, 0],
                //width: 120,
                height: 30,
                style: {
                    overflow: 'visible'
                },
                skipClone: true
              },
              exporting:{
                enabled: false
              },
              title: {
                text: ''
              },
              credits: {
                enabled: false
              },
              xAxis: {
                labels: {
                  enabled: false
                },
                title: {
                  text: null
                },
//                lineWidth: 0,
                lineColor: '#303030',
//                gridLineWidth: 0,
//                minorGridLineWidth: 0,
                startOnTick: false,
                endOnTick: false,
                tickPositions: []
              },
              yAxis: {
                endOnTick: false,
                startOnTick: false,
                labels: {
                  enabled: false
                },
                title: {
                  text: null
                },
                tickPositions: [0]
              },
              legend: {
                enabled: false
              },
              tooltip: {
                formatter: function(){
                  return this.y;
                }
              },
              plotOptions: {
                series: {
                    animation: false,
                    lineWidth: 1,
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    marker: {
                        radius: 1,
                        states: {
                            hover: {
                                radius: 2
                            }
                        }
                    },
                    fillOpacity: 0.25
                }
              }
            },
            series: $scope.twitterIngestRateSeries,
//               func: function(chart) {
//                    $timeout(function() {
//                        chart.reflow();
//                    }, 0);
//                },
            loading: false
        }
          
      }],
      link: function postLink(scope, element, attrs) {
        
      }
    };
  }
  
})();