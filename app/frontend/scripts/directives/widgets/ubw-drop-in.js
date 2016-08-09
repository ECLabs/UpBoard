(function(){
    'use strict';

    /**
     * @ngdoc directive
     * @name upBoardApp.directive:ubwDropIn
     * @description
     * # dropIn
     */
    angular.module('upBoardApp')
      .directive('ubwDropIn', dropIn);
    
    dropIn.$inject = ['$log', '$timeout', '$document', '$http', 'ubSocketIo', 'utility'];
    function dropIn($log, $timeout, $document, $http, ubSocketIo, utility) {
        return {
          templateUrl: '/app/frontend/scripts/directives/widgets/ubw-drop-in.tpl.html',
          restrict: 'E',
          replace: true,
          scope:{
            header: '@',
            sources: '@',
            imagePaths: '@',
            event: '@'
          },
          link: function(scope, element, attrs){

            scope.messages = [];
            scope.sourcesArr = scope.sources.split(',');
            scope.imagePathsArr = scope.imagePaths.split(',');
            
            // Matter module aliases
            var Engine = Matter.Engine,
                World = Matter.World,
                //Body = Matter.Body,
                Bodies = Matter.Bodies,
                Common = Matter.Common,
                //Composite = Matter.Composite,
                //Composites = Matter.Composites,
                //Events = Matter.Events,
                MouseConstraint = Matter.MouseConstraint;

            // extend base Render class, modify how body ids are displayed
            var CustomRender = {};
            angular.extend(CustomRender, Matter.Render);

            // method override
            CustomRender.bodyIds = function(engine, bodies, context) {
                var c = context,
                    i,
                    j;

                for (i = 0; i < bodies.length; i++) {
                    if (!bodies[i].render.visible)
                        continue;

                    var parts = bodies[i].parts;
                    for (j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
                        var part = parts[j];
                        c.font = '14px Helvetica';
                        c.textAlign = 'center';
                        c.fillStyle = 'rgba(255,255,255,1)';

                        // *** changed to display passed in body id instead *** //
                        c.fillText(bodies[i].bodyId != null ? bodies[i].bodyId : '', part.position.x, part.position.y);
                    }
                }
            };

            // create a Matter.js engine, use CustomRender
            var engine = Engine.create(element.find('.ubw-drop-in-point')[0], {
              render: {
                controller: CustomRender,
                options: {
                  showAngleIndicator: false,
                  wireframes: false,
                  background: 'transparent',
                  showIds: true,
                  hasBounds: true
                }
              }
            });

            // add a mouse controlled constraint
            var mouseConstraint = MouseConstraint.create(engine);
            World.add(engine.world, mouseConstraint);

            var offset = 0,
                options = { 
                    isStatic: true,
                    render: {
                        visible: true
                    }
                };

            engine.world.bodies = [];

            // static walls
            World.add(engine.world, [
                Bodies.rectangle(600, 250, 600, 5, { isStatic: true, angle: -Math.PI * 0.06 }),
                Bodies.rectangle(240, 580, 600, 5, { isStatic: true, angle: Math.PI * 0.06 }),
                Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 1, options),      // top
                Bodies.rectangle(300, 600 + offset, 700.5 + 2 * offset, 1, options),
                Bodies.rectangle(800 + offset, 300, 1, 600.5 + 2 * offset, options),
                Bodies.rectangle(-offset, 300, 1, 600.5 + 2 * offset, options)
            ]);

            scope.engine = engine;
            scope.world = World;
            scope.bodies = Bodies;

            // run the engine
            Engine.run(engine);
            
            
            // This method is used to add a body to the world.
            function addBody(data){
                
              var x = 700, y = 0;
              var body;

              var colorArr = ['#CF4858','#F6624A','#1B6A81','#16A79D',
                              '#80628B','#DC557A','#F4AC42','#4F8598','#69B1CB'];

              var fillColor = Common.choose(colorArr);

              scope.messages.push(data.toString()); // use to keep track of doc id's

              var index = scope.sourcesArr.indexOf(data.source);
              
              // pass additional body id option to display
              if (index !== -1 && scope.imagePathsArr[index] != null) {
                body = Bodies.rectangle(x, y, 70, 70, {
                  bodyId: scope.messages.length,
                  friction: 0.0001,
                  restitution: 0.5,
                  density: 0.001,
                  render:{
                    sprite:{
                      texture: scope.imagePathsArr[index]
                    }
                  }
                });
              }
              else if (Common.random() > 0.35) {
                var randDim = Common.random(60, 70);
                body = Bodies.rectangle(x, y, randDim, randDim, {
                  bodyId: scope.messages.length,
                  friction: 0.0001,
                  restitution: 0.5,
                  density: 0.001,
                  render:{
                    fillStyle: fillColor,
                    strokeStyle: '#ffffff'
                  }
                });
              }
              else {
                body = Bodies.circle(x, y, Common.random(30, 40), {
                    bodyId: scope.messages.length,
                    friction: 0.0001,
                    restitution: 0.5,
                    density: 0.001,
                    render:{
                      fillStyle: fillColor,
                      strokeStyle: '#ffffff'
                    }
                });
              }
              scope.world.add(scope.engine.world, body);
            }
            
            ubSocketIo.on(scope.event, function(data) {
              addBody(data);
            });
            
            // for DEMO purposes, remove eventually
            element.on('click', function(event){
              
              var rand = Math.round(Math.random());  // pick a random source
              var dummyData = {source: rand === 0 ? 'twitter' : 'reddit', content:'random text over and over again'};
              
              $http.post('/feed', {'event':'testEvent', 'source':dummyData.source, 'content':dummyData.content}).then(function(){
                $log.debug('post to server');
              });
            });
          }
        };
    }
})();