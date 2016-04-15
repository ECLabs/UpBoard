(function(){
  
  'use strict';

  /**
   * @ngdoc directive
   * @name upBoardApp.directive:ubwSparkline
   * @description
   * # ubwSparkline
   */
  angular.module('upBoardApp')
    .directive('ubwSparkline', ubwSparkline);
  
  ubwSparkline.$inject = ['$log', '$timeout'];
  function ubwSparkline($log, $timeout) {
      return {
        templateUrl: '/app/frontend/scripts/directives/widgets/ubw-sparkline.tpl.html',
        restrict: 'E',
        replace: true,
        scope: {
          header: '@',
          value: '@'
        },
        controller: ['$scope', function($scope){
          
          $scope.sparklineChartSeries = [{data:[]}];
          
          $scope.sparklineChartConfig = {

              options: {
                chart: {
                  type: 'line',
                  backgroundColor: null,
                  borderWidth: 0,
                  margin: [2, 0, 2, 0],
                  //width: 120,
                  height: 150,
                  style: {
                      overflow: 'visible'
                  },
                  skipClone: true
                },
                exporting:{
                  enabled: false
                },
                title: {
                  text: null
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
                  lineColor: '#303030',
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
                      color: '#FFFFFF',
                      animation: false,
                      shadow: false,
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
              series: $scope.sparklineChartSeries,
              loading: false,
              func: function(chart){

                // need this to properly size chart due to dynamic parent container size
                $timeout(function(){
                  chart.reflow();
                }, 0);
              }
          }
        }],
        link: function postLink(scope, element, attrs) {
          
          scope.$watch(function(){ return scope.value; }, function(){
            scope.sparklineChartSeries[0].data.push(Number.parseInt(scope.value)); // Highcharts really doesn't like String values
            if(scope.sparklineChartSeries[0].data.length > 20) scope.sparklineChartConfig.series[0].data.shift();
          });
        }
      };
    }
})();