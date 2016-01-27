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
      link: function postLink(scope, element, attrs) {
        
        function updateTotalIngest(){
          
          scope.totalDocsIngestedToday = 0;
          scope.totalDocsIngestedYesterday = 0;
          
          // add up counts from all sources, calculate delta
          for(var i = 0; i < scope.sources.length; i++){
            
            var source = scope.sources[i];
            scope.totalDocsIngestedToday += scope[source + 'IngestCountToday'];
            scope.totalDocsIngestedYesterday += scope[source + 'IngestCountYesterday'];
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
        }
        
        function updateUptime(source, totalMinutes, downMinutes){
          
          scope[source + 'UptimeHours'] = Math.round((totalMinutes - downMinutes) / 60);
          scope[source + 'UptimePercentage'] = Math.round(((totalMinutes - downMinutes) / totalMinutes) * 100);
        }
        
        
        /* TODO generate dashboard dynamically with firebase data - scope.data.rows
        
        // TODO widget values <- dashboard widget loader needs to initialize w/DB values and then switch to use scope variables
        
        rows:{
          0: {
            widgets: {
              0: {
                columns: 1 // spacer
              },
              1: {
                columns: 6,
                type: 'numsWithDelta',
                header: 'Documents Ingested',
                labels: 'Today,Yesterday,Delta (24 hrs)',
                values: '612,5750,0.11'
              }
              2: {
                columns: 4,
                type: 'barChart',
                header: 'Documents Ingested / Source',
                labels: 'twitter,reddit',
                colors: '#48bcfa,#ff4605',
                values: '420,192'
              },
              3: {
                columns: 1
              }
            },
          },
          1: {
            widgets: {
              0: {
                columns: 1
              },
              1: {
                columns: 4,
                widgets: {
                  0: {
                    type: 'rateAndCountWithDelta',
                    header: 'Twitter Error Rate and Count',
                    rate: .05,
                    count: 21,
                    delta: .21
                  },
                  1: {
                    type: 'rateAndCountWithDelta',
                    header: 'Reddit Error Rate and Count',
                    rate: .04,
                    count: 7,
                    delta: .33
                  }
                }
              },
              2: {
                columns: 2,
                widgets: {
                  0: {
                    type: 'numAndSparkline',
                    header: 'Twitter Ingest Rate',
                    value: 88
                  },
                  1: {
                    type: 'numAndSparkline',
                    header: 'Reddit Ingest Rate',
                    value: 63
                  }
                }
              },
              3: {
                columns: 4,
                type: 'feed',
                header: 'Document Feed',
                sources: 'twitter,reddit',
                colors: '#81cdff,#fa7f53',
                event: 'feedEvent'
              },
              4: {
                columns: 1
              }
            }
          },
          2: {
            widgets: {
              0: {
                columns: 1
              },
              1: {
                columns: 2,
                type: 'numAndGauge',
                header: 'Twitter Uptime',
                label: 'hours',
                value: 51,
                gaugeValue: 91
              },
              2: {
                columns: 2,
                type: 'numAndGauge',
                header: 'Reddit Uptime',
                label: 'hours',
                value: 8,
                gaugeValue: 50
              },
              3: {
                columns: 2,
                type: 'status',
                labels: 'Twitter,Reddit',
                values: 'running,stopped'
              },
              4: {
                columns: 4,
                type: 'dropIn',
                header: '',
                sources: 'twitter,reddit',
                imagePaths: '/images/twitter_smlogo_texture.png,/images/reddit_smlogo_texture.png'
              },
              5: {
                columns: 1
              }
            }
          }
        }
        */
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
            scope[source + 'Status'] = 'running';
            updateIngestRate(source, 103);
            updateUptime(source, 3340, 300);
          }
          else if(source === 'reddit'){
            scope[source + 'ErrorCountToday'] = 7;
            scope[source + 'ErrorCountYesterday'] = 21;
            scope[source + 'IngestCountToday'] = 192;
            scope[source + 'IngestCountYesterday'] = 1250;
            scope[source + 'Status'] = 'stopped';
            updateIngestRate(source, 51);
            updateUptime(source, 1000, 501);
          }
          updateErrorRateAndDelta(source);
        }
        
        updateTotalIngest();
        
        
       /* Incoming request body
        event   = ingestEvent
        source  = twitter
        content = {
          "today":{
            "errorCount": 21,
            "ingestCount": 420,
            "ingestRate": 103
          },
          "yesterday":{
            "errorCount": 150,
            "ingestCount": 4500
          },
          "status": "running",
          "uptime":{
            "totalMinutes": 3340,
            "downMinutes": 300
          }
        }
        */
        // make event configurable via scope data
        ubSocketIo.on('ingestEvent', function(data){

          $log.debug(data)
          $log.debug(JSON.parse(data.content));
          
          var source = data.source;
          var content = JSON.parse(data.content);
          
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
            
            if(content.status != null){
              scope[source + 'Status'] = content.status;
            }
            
            if(content.uptime != null){
              
              var totalMinutes = content.uptime.totalMinutes;
              var downMinutes = content.uptime.downMinutes;
              if(totalMinutes != null &&  downMinutes != null){
                updateUptime(source, totalMinutes, downMinutes);
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
//          var data = scope[source + 'IngestRateConfig'].series[0].data;
//          data.push(y);
          scope[source + 'IngestRateToday'] = y;
//          if(data.length > 20) data.shift();
        }
        
        $interval(function () {
          updateSparklineChartDemo('twitter');
        }, 5000);

        $interval(function () {
          updateSparklineChartDemo('reddit');
        }, 5000);
      }
    };
  }
  
})();