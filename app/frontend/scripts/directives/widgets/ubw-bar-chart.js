(function(){
  
  'use strict';

  /**
   * @ngdoc directive
   * @name upBoardApp.directive:ubwBarChart
   * @description
   * # ubwBarChart
   */
  angular.module('upBoardApp')
    .directive('ubwBarChart', ubwBarChart);

  ubwBarChart.$inject = ['$log', '$timeout', 'ubSocketIo'];
  function ubwBarChart($log, $timeout, ubSocketIo) {
    return {
      templateUrl: '/app/frontend/scripts/directives/widgets/ubw-bar-chart.tpl.html',
      restrict: 'E',
      replace: true,
      scope: {
        header: '@',
        labels: '@',
        colors: '@',
        values: '@',
        valueSuffix: '@',
        event: '@'
      },
      controller: ['$scope', function($scope){

        $scope.barChartCategories = $scope.labels.split(',');
        $scope.barChartSeries = [{data:$scope.values.split(',').map(Number)}];
        $scope.barChartColors = $scope.colors.split(',');

        $scope.barChartConfig = {

          options: {
            chart: {
              type: 'bar',
              backgroundColor: null,
              borderWidth: 0,
              height: 200
            },
            xAxis: {
              categories: $scope.barChartCategories,
              title: {
                text: null
              },
              lineColor: '#303030',
              tickColor: '#303030',
              labels: {
                style: {"color":"white"}
              }
            },
            yAxis: {
              labels: {
                enabled: false
              },
              title: {
                text: null
              },
              gridLineColor: '#303030'
            },
            legend: {
              enabled: false
            },
            exporting: {
              enabled: false
            },
            title: {
              text: null
            },
            tooltip: {
              formatter: function(){
                return this.y + $scope.valueSuffix;
              },
              followPointer: true,
              hideDelay: 0
            },
            plotOptions: {
              bar: {
                colors: $scope.barChartColors,
                colorByPoint: true,
                dataLabels: {
                  enabled: true,
                  color: 'white',
                  style: {"textShadow":""},
                  formatter: function(){
                    return this.y + $scope.valueSuffix;
                  }
                },
                animation: false,
                shadow: false,
                fillOpacity: 0.25
              }
            }
          },
          series: $scope.barChartSeries,
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

        ubSocketIo.on(scope.event, function(data){
          scope.values = data.values;
          
          $log.debug(data);
          scope.barChartSeries[0].data = data.values;
        });
        
//        scope.$watch(function(){ return scope.values }, function(){
//          scope.barChartSeries[0].data = scope.values.split(',').map(Number);
//        });
      }
    };
  }
})();