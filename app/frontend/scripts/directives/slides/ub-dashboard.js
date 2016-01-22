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
  
  ubDashboard.$inject = ['$log', '$timeout', '$interval', 'highchartsNG'];
  function ubDashboard($log, $timeout, $interval, highchartsNG) {
    return {
      templateUrl: '/app/frontend/scripts/directives/slides/ub-dashboard.tpl.html',
      restrict: 'E',
      replace: true,
      scope:{
        data: '=',
        index: '@'
      },
      controller: ['$scope', function($scope){
        
        // TODO initial data pull
        $scope.docsIngestedPerSrcSeries = [{data:[420, 192]}]
        
        $scope.twitterIngestRateSeries = [{data:[103]}];
        $scope.twitterIngestRateCurrent = 103;
        
        $scope.redditIngestRateSeries = [{data:[51]}];
        $scope.redditIngestRateCurrent = 51;
        
        $scope.uptimeHoursSeries = [{data: [97]}];
        
        
        $scope.docsIngestedPerSrcConfig = {
          
          options: {
            chart: {
              type: 'bar',
              backgroundColor: null,
              borderWidth: 0,
              height: 100
            },
            xAxis: {
              categories: ['twitter', 'reddit'],
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
                return this.y;
              },
              followPointer: true,
              hideDelay: 0
            },
            plotOptions: {
              bar: {
                colors: ['#48bcfa', '#ff4605'],
                colorByPoint: true,
                dataLabels: {
                  enabled: true,
                  color: 'white',
                  style: {"textShadow":""}
                },
                animation: false,
                shadow: false,
                fillOpacity: 0.25
              }
            }
          },
          series: $scope.docsIngestedPerSrcSeries,
          loading: false
        }
        
        $scope.twitterIngestRateConfig = {

            options: {
              chart: {
                type: 'line',
                backgroundColor: null,
                borderWidth: 0,
                margin: [2, 0, 2, 0],
                //width: 120,
                height: 40,
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
                    color: '#48bcfa',
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
            series: $scope.twitterIngestRateSeries,
            loading: false
        }
        
        $scope.redditIngestRateConfig = {
            options: {
              chart: {
                backgroundColor: null,
                borderWidth: 0,
                type: 'line',
                margin: [2, 0, 2, 0],
                //width: 120,
                height: 40,
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
                    color: '#48bcfa',
                    animation: true,
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
            series: $scope.redditIngestRateSeries,
            loading: false
        }
        
        
        $scope.uptimeHoursConfig = {
          
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
          series: $scope.uptimeHoursSeries,
          loading: false
        }
      }],
      link: function postLink(scope, element, attrs) {
        
        // TODO switch to have socket event listeners, interval will be handled by frequency of POSTS
        $interval(function () {
          var y = Math.round(Math.random() * 100);
          var data = scope.twitterIngestRateConfig.series[0].data;
          data.push(y);
          scope.twitterIngestRateCurrent = y;
          //if(data.length > 0) data.shift();
        }, 5000);

        $interval(function () {
          var y = Math.round(Math.random() * 100);
          var data = scope.redditIngestRateConfig.series[0].data;
          data.push(y);
          scope.redditIngestRateCurrent = y;
          //if(data.length > 0) data.shift();
        }, 5000);
      }
    };
  }
  
})();