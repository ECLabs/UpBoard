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
  
  ubDashboard.$inject = ['$log', '$timeout', '$interval', '$filter', '$compile', '$window',
                         'highchartsNG', 'ubSocketIo', 'utility'];
  function ubDashboard($log, $timeout, $interval, $filter, $compile, $window, highchartsNG, ubSocketIo, utility) {
    return {
      templateUrl: '/app/frontend/scripts/directives/slides/ub-dashboard.tpl.html',
      restrict: 'E',
      replace: true,
      scope:{
        data: '=',
        index: '@'
      },
      link: function postLink(scope, element, attrs) {
        
        var savedData = null;
        var savedEvent = null; // use to keep track of adding event listener only once
        
        var sources = [];
        
        function updateTotalIngest(){
          
          scope.totalDocsIngestedToday = 0;
          scope.totalDocsIngestedYesterday = 0;
          
          // add up counts from all sources, calculate delta
          for(var i = 0; i < sources.length; i++){
            
            var source = sources[i];
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
        layout: {  
          rows:{
            0: {
              widgets: {
                0: {
                  columns: 1 // spacer
                },
                1: {
                  columns: 6,
                  type: 'numsWithDelta',
                  sources: 'twitter,reddit',
                  header: 'Documents Ingested',
                  labels: 'Today,Yesterday,Delta (24 hrs)'
                }
                2: {
                  columns: 4,
                  type: 'barChart',
                  sources: 'twitter,reddit',
                  header: 'Documents Ingested / Source',
                  labels: 'twitter,reddit',
                  colors: '#48bcfa,#ff4605'
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
                      source: 'twitter',
                      header: 'Twitter Error Rate and Count'
                    },
                    1: {
                      type: 'rateAndCountWithDelta',
                      source: 'reddit',
                      header: 'Reddit Error Rate and Count'
                    }
                  }
                },
                2: {
                  columns: 2,
                  widgets: {
                    0: {
                      type: 'numAndSparkline',
                      source: 'twitter',
                      header: 'Twitter Ingest Rate'
                    },
                    1: {
                      type: 'numAndSparkline',
                      source: 'reddit',
                      header: 'Reddit Ingest Rate'
                    }
                  }
                },
                3: {
                  columns: 4,
                  type: 'feed',
                  sources: 'twitter,reddit',
                  header: 'Document Feed',
                  colors: '#81cdff,#fa7f53',
                  event: 'testEvent'
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
                  source: 'twitter',
                  header: 'Twitter Uptime',
                  label: 'hours'
                },
                2: {
                  columns: 2,
                  type: 'numAndGauge',
                  source: 'reddit',
                  header: 'Reddit Uptime',
                  label: 'hours'
                },
                3: {
                  columns: 2,
                  type: 'status',
                  labels: 'Twitter,Reddit'
                },
                4: {
                  columns: 4,
                  type: 'dropIn',
                  sources: 'twitter,reddit',
                  imagePaths: '/images/twitter_smlogo_texture.png,/images/reddit_smlogo_texture.png',
                  event: 'testEvent'
                },
                5: {
                  columns: 1
                }
              }
            }
          }
        }
        */
        
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
            "ingestCount": 192
          },
          "status": "running",
          "uptime":{
            "totalMinutes": 3340,
            "downMinutes": 300
          }
        }
        */
        // make event configurable via scope data
        
        scope.$watch(attrs.ngShow, function(){
        
          var isShown = scope.$eval(attrs.ngShow);

          if(isShown){
            
            // initial load from previously saved data, after that use socket event listeners to update via POSTS
            var snapshot = scope.data.content.snapshot;
            if(snapshot != null){
            
              for(var i = 0; i < snapshot.length; i++){
                
                var source = snapshot[i].source;
                var content = snapshot[i].content;
                
                scope[source + 'ErrorCountToday'] = content.today.errorCount;
                scope[source + 'ErrorCountYesterday'] = content.yesterday.errorCount;
                scope[source + 'IngestCountToday'] = content.today.ingestCount;
                scope[source + 'IngestCountYesterday'] = content.yesterday.ingestCount;
                scope[source + 'Status'] = content.status;
                updateIngestRate(source, content.today.ingestRate);
                updateUptime(source, content.uptime.totalMinutes, content.uptime.downMinutes);
                updateErrorRateAndDelta(source);
                
                sources.push(source); // save source to list of sources
              }
              updateTotalIngest();
            }
            
            // build dashboard layout
            var htm = '<div class="ub-dashboard">';

            var layout = scope.data.content.layout;
            for(var i = 0; i < layout.rows.length; i++){

              var row = layout.rows[i];
              
              htm += '<div class="row">'
              
              // load dashboard widgets
              var widgets = row.widgets;
              
              if(widgets != null){
                
                for(var j = 0; j < widgets.length; j++){
                  
                  var widget = widgets[j];
                  
                  htm += '<div class="col-lg-' + widget.columns + '">';
                  
                  (function buildWidget(widget){
                    
                    if(widget.type != null){

                      var tag = 'ubw-' + utility.camelToHyphen(widget.type);

                      $log.debug(tag)

                      // need to be specific for now in order to map to angular model
                      // TODO - look into making this more dynamic/generic
                      if(widget.type === 'numsWithDelta'){

                        htm += '<' + tag + ' header="' + widget.header + '" labels="' + widget.labels + '" values="{{ totalDocsIngestedToday }},{{ totalDocsIngestedYesterday }},{{ totalDocsIngestedDelta }}"></' + tag + '>';

                      }
                      else if(widget.type === 'barChart'){

                        htm += '<' + tag + ' header="' + widget.header + '" labels="' + widget.labels + '" colors="' + widget.colors + '" values="{{ twitterIngestCountToday }},{{ redditIngestCountToday }}"></' + tag + '>'; 

                      }
                      else if(widget.type === 'rateAndCountWithDelta'){

                        htm += '<' + tag + ' header="' + widget.header + '" rate="{{ ' + widget.source + 'ErrorRate }}" count="{{ ' + widget.source + 'ErrorCountToday }}" delta="{{ ' + widget.source + 'ErrorDelta }}"></' + tag + '>'; 
                      }

                      else if(widget.type === 'numAndSparkline'){

                        htm += '<' + tag + ' header="' + widget.header + '" value="{{ ' + widget.source + 'IngestRateToday }}"></' + tag + '>'; 
                      }

                      else if(widget.type === 'feed'){

                        htm += '<' + tag + ' header="' + widget.header + '" sources="' + widget.sources + '" colors="' + widget.colors + '" event="' + widget.event + '"></' + tag + '>'; 
                      }

                      else if(widget.type === 'numAndGauge'){

                        htm += '<' + tag + ' header="' + widget.header + '" label="' + widget.label + '" value="{{ ' + widget.source + 'UptimeHours }}" gauge-value="{{ ' + widget.source + 'UptimePercentage }}"></' + tag + '>'; 
                      }

                      else if(widget.type === 'status'){

                        htm += '<' + tag + ' header="' + widget.header + '" labels="' + widget.labels + '" values="{{ twitterStatus }},{{ redditStatus }}"></' + tag + '>'; 
                      }

                      else if(widget.type === 'dropIn'){

                        htm += '<' + tag + ' sources="' + widget.sources + '" image-paths="' + widget.imagePaths + '" event="' + widget.event + '"></' + tag + '>'; 
                      }
                      
                      else if(widget.type === 'profile'){
                        htm += '<' + tag + ' src="' + widget.src + '" name="' + widget.name + '" description="' + widget.description + '" degree="' + widget.degree + '"></' + tag + '>'; 
                      }
                      
                      else if(widget.type === 'percentage'){
                        htm += '<' + tag + ' header="' + widget.header + '" value="' + widget.value + '"></' + tag + '>'; 
                      }
                      
                      else if(widget.type === 'sparkline'){

                        htm += '<' + tag + ' header="' + widget.header + '" value="{{ ' + widget.source + 'IngestRateToday }}"></' + tag + '>'; 
                      }
                    }
                    else if(widget.widgets != null){

                      // column nested widgets
                      for(var k = 0; k < widget.widgets.length; k++){
                        buildWidget(widget.widgets[k]);  
                      }
                    }
                    else {
                      // spacer, check for columns
                      $log.debug(widget.columns)
                    }
                  })(widget);
                  
                  htm += '</div>';
                }
              }
              htm += '</div>'  
            }
            
            $log.debug(htm)

            htm += '</div>';
            
            var compiled = $compile(htm)(scope);
            element.append(compiled);

            $log.debug(scope.data.content.event)
            
            // only open socket once per event, event name could change dynamically
            if(scope.data.content.event != null && savedEvent !== scope.data.content.event){

              // remove previous listener if event name changes
              if(savedEvent !== null) ubSocketIo.removeListener(savedEvent);
                  
              ubSocketIo.on(scope.data.content.event, function(data){

//                $log.debug(data)
//                $log.debug(JSON.parse(data.content));

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
              
              // save event to keep track if it changes
              savedEvent = scope.data.content.event;
            }
            utility.setEntryTransition(element, scope.data);
            savedData = scope.data;
          }
          else if(savedData != null){
            $log.debug('about to hide ' + savedData.type + ', next type on deck: ' + scope.data.type);
            utility.setExitTransition(element, savedData);
            
            // TODO take a snapshot, turn off socket listener
            
            
            savedData = null;
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