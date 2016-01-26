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
  
  ubDashboard.$inject = ['$log', '$timeout', '$interval', '$filter', 'highchartsNG', 'ubSocketIo'];
  function ubDashboard($log, $timeout, $interval, $filter, highchartsNG, ubSocketIo) {
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
        
        function updateTotalIngest(){
          
          scope.totalDocsIngestedToday = 0;
          scope.totalDocsIngestedYesterday = 0;
          
          // add up counts from all sources, calculate delta
          for(var i = 0; i < scope.sources.length; i++){
            scope.totalDocsIngestedToday += scope[scope.sources[i] + 'IngestCountToday'];
            scope.totalDocsIngestedYesterday += scope[scope.sources[i] + 'IngestCountYesterday'];
          }
          
          // calculate delta
          scope.totalDocsIngestedDelta = scope.totalDocsIngestedYesterday !== 0 ?
                                         scope.totalDocsIngestedToday / scope.totalDocsIngestedYesterday : 0;
        }
        
        function updateErrorRateAndDelta(source){
          
          scope[source + 'ErrorRate'] = scope[source + 'IngestCountToday'] !== 0 ?
                                        scope[source + 'ErrorCountToday'] / scope[source + 'IngestCountToday'] : 'N/A';
          scope[source + 'ErrorDelta'] = scope[source + 'ErrorCountYesterday'] !== 0 ?
                                         scope[source + 'ErrorCountToday'] / scope[source + 'ErrorCountYesterday'] : 'N/A';
        }
        
        function updateIngestRate(source, rate){
          
          scope[source + 'IngestRateToday'] = rate;
          
          // update sparkline chart
          var data = scope[source + 'IngestRateConfig'].series[0].data;
          data.push(rate);
          if(data.length > 20) data.shift();
        }
        
        
        // initial pull from scope.data, after that use socket event listeners to update via POSTS
        
        // TODO pull this saved data from scope.data.content.snapshot?
        scope.sources = ['twitter', 'reddit'];
        for(var i = 0; i < scope.sources.length; i++){
          
          var source = scope.sources[i];
          
          if(source === 'twitter'){
            scope[source + 'ErrorCountToday'] = 21;
            scope[source + 'ErrorCountYesterday'] = 101;
            scope[source + 'IngestCountToday'] = 420;
            scope[source + 'IngestCountYesterday'] = 4500;
            scope[source + 'IngestRateToday'] = 103;
          }
          else if(source === 'reddit'){
            scope[source + 'ErrorCountToday'] = 7;
            scope[source + 'ErrorCountYesterday'] = 21;
            scope[source + 'IngestCountToday'] = 192;
            scope[source + 'IngestCountYesterday'] = 1250;
            scope[source + 'IngestRateToday'] = 51;
          }
          updateErrorRateAndDelta(source);
        }
        
        updateTotalIngest();
        
        
       /* Incoming JSON Data
        source: 'twitter,
        content: {
          today:{
            errorCount: 21,
            ingestCount: 420,
            ingestRate: 103
          }
          yesterday:{
            errorCount: 150
            ingestCount: 4500
          },
          status: 'running'
        }
        */
        // make event configurable via scope data
        ubSocketIo.on('ingestEvent', function(data){

          $log.debug(data)
          $log.debug(JSON.parse(data.content));
          
          var source = data.source;
          var content = JSON.parse(data.content);
          
          // TODO update to handle array of source data
          if(content != null){

            if(content.today != null){

              var errorCountToday = content.today.errorCount;
              if(errorCountToday != null){
                scope[source + 'ErrorCountToday'] = errorCountToday;
                updateErrorRateAndDelta(source);
              }
              
              var ingestCountToday = content.today.ingestCount;
              if(ingestCountToday != null){
                scope[source + 'IngestCountToday'] = ingestCountToday;
                updateTotalIngest();
              }
              
              var ingestRateToday = content.today.ingestRate;
              if(ingestRateToday != null){
                updateIngestRate(source, ingestRateToday);
              }
            }

            if(content.yesterday != null){

              var errorCountYesterday = content.yesterday.errorCount;
              if(errorCountYesterday != null){
                scope[source + 'ErrorCountYesterday'] = errorCountYesterday;
                updateErrorRateAndDelta(source);
              }
              
              var ingestCountYesterday = content.yesterday.ingestCount;
              if(ingestCountYesterday != null){
                scope[source + 'IngestCountYesterday'] = ingestCountYesterday;
                updateTotalIngest();
              }
            }
          }

          else {
            $log.warn('no content specified, ignoring');
          }

        });
            
        
        
        // ingest rates
        // TODO for DEMO only - remove eventually, interval will be handled by frequency of POSTS
        
        function updateSparklineChartDemo(source){
          
          var y = Math.round(Math.random() * 100);
          var data = scope[source + 'IngestRateConfig'].series[0].data;
          data.push(y);
          scope[source + 'IngestRateToday'] = y;
          if(data.length > 20) data.shift();
        }
        
        $interval(function () {
          updateSparklineChartDemo('twitter');
        }, 5000);

        $interval(function () {
          updateSparklineChartDemo('reddit');
        }, 5000);
        
        // activity
        
        // uptime
        
        // status
        
        // docs/source
        
      }
    };
  }
  
})();