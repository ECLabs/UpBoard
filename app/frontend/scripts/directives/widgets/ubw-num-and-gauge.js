(function(){
  
  'use strict';

  /**
   * @ngdoc directive
   * @name upBoardApp.directive:ubwNumAndGauge
   * @description
   * # ubwNumAndGauge
   */
  angular.module('upBoardApp')
    .directive('ubwNumAndGauge', ubwNumAndGauge);
  
  ubwNumAndGauge.$inject = ['$log', '$timeout'];
  function ubwNumAndGauge($log, $timeout) {
    return {
      templateUrl: '/app/frontend/scripts/directives/widgets/ubw-num-and-gauge.tpl.html',
      restrict: 'E',
      replace: true,
      scope:{
        header: '@',
        label: '@',
        value: '@',
        gaugeValue: '@'
      },
      controller: ['$scope', function($scope){
        
        $scope.gaugeChartSeries = [{data:[]}];
        
        $scope.gaugeChartConfig = {
          
          options: {
            chart: {
              type: 'solidgauge',
              backgroundColor: null,
              borderWidth: 0,
              height: 150
            },
            pane: {
              center: ['50%', '85%'],
              size: '140%',
              startAngle: -90,
              endAngle: 90,
              background: {
                backgroundColor:'#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
              }
            },
            exporting: {
              enabled: false
            },
            tooltip: {
              hideDelay: 0,
              followPointer: true,
              formatter: function(){
                return this.y + '%';
              }
            },
            plotOptions: {
              solidgauge: {
                dataLabels: {
                  y: -30,
                  borderWidth: 0,
                  format: '<div style="text-align:center"><span style="font-size:25px;color:white;">{y}</span><br/>' +
                       '<span style="font-size:12px;color:silver">%</span></div>',
                  useHTML: true
                }
              }
            },
          },
          title: {
              text: null,
          },
          yAxis: {
            min: 0,
            max: 100,
//            title: {
//                y: 140
//            },      
            stops: [
              [0.1, '#DF5353'], // red
              [0.5, '#DDDF0D'], // yellow
              [0.9, '#55BF3B'] // green
            ],
            lineWidth: 0,
            tickInterval: 100,
            //tickInterval: 20,
//            tickPixelInterval: 400,
            tickWidth: 0,
            labels: {
              style: {"color":"white"},
              y: 15
            }  
          },
          series: $scope.gaugeChartSeries,
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
          scope.gaugeChartSeries[0].data = [Number.parseInt(scope.gaugeValue)]; 
        });
      }
    };
  }
  
})();  