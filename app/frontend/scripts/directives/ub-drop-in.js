(function(){
    'use strict';

    /**
     * @ngdoc directive
     * @name upBoardApp.directive:ubDropIn
     * @description
     * # dropIn
     */
    angular.module('upBoardApp')
      .directive('ubDropIn', dropIn);
    
    dropIn.$inject = ['$log', '$document', 'utility'];
    function dropIn($log, $document, utility) {
        return {
          templateUrl: '/app/frontend/scripts/directives/ub-drop-in.tpl.html',
          restrict: 'E',
          replace: true,
          scope:{
              data: "="
          },
          link: function(scope, element, attrs){

              var savedData; // use to remember for exit transition
              scope.messages = [];
            
              // Matter module aliases
              var Engine = Matter.Engine,
                  World = Matter.World,
                  Body = Matter.Body,
                  Bodies = Matter.Bodies,
                  Common = Matter.Common,
                  Composite = Matter.Composite,
                  Composites = Matter.Composites,
                  Events = Matter.Events,
                  MouseConstraint = Matter.MouseConstraint;
            
              // create a Matter.js engine
              var engine = Engine.create(document.getElementById('dropInPoint'), {
                render: {
                  options: {
                    showAngleIndicator: false,
                    wireframes: false,
                    background: '#ffffff',
                    showIds: true
              //            width: 1000,
              //            height: 1000
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
                          visible: false
                      }
                  };

              engine.world.bodies = [];

              // these static walls will not be rendered in this sprites example, see options
              World.add(engine.world, [
                  Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 5, options),
                  Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 5, options),
                  Bodies.rectangle(800 + offset, 300, 5, 600.5 + 2 * offset, options),
                  Bodies.rectangle(-offset, 300, 5, 600.5 + 2 * offset, options)
              ]);

              //                      var stack = Composites.stack(20, 20, 10, 10, 0, 0, function(x, y) {
              //                          if (Common.random() > 0.35) {
              //                              return Bodies.rectangle(x, y, 64, 64, {
              //                //                  render: {
              //                //                      strokeStyle: '#ffffff',
              //                //                      sprite: {
              //                //                          texture: 'http://brm.io/matter-js-demo-master/img/box.png'
              //                //                      }
              //                //                  }
              //                              });
              //                          } else {
              //                              return Bodies.circle(x, y, Common.random(30,50), {
              //                                  density: 0.0005,
              //                                  frictionAir: 0.06,
              //                                  restitution: 0.3,
              //                                  friction: 0.01,
              //                //                  render: {
              //                //                      sprite: {
              //                //                          texture: 'http://brm.io/matter-js-demo-master/img/ball.png'
              //                //                      }
              //                //                  }
              //                              });
              //                          }
              //                      });

              //                      var comp = Composite.create();
              //
              //                //      var stack = Composites.
              //                      for(var i = 0; i < 20; i++){
              //                        comp.bodies.push(Bodies.circle(10, 20, Common.random(30,40), {
              //                            density: 0.0005,
              //                            frictionAir: 0.06,
              //                            restitution: 0.3,
              //                            friction: 0.01
              //                        }));
              //                      }
              //World.add(engine.world, stack);

              //      var rect = Bodies.rectangle(20, 20, 64, 64);
              //      
              //      
              //      World.add(engine.world, rect);
              //      }
              scope.engine = engine;
              scope.world = World;
              scope.bodies = Bodies;


              //                    Events.on(engine, 'afterRender', function(event) {
              //                        var context = engine.render.context;
              //                        context.font = "45px 'Cabin Sketch'";
              //                        context.fillText("THROW OBJECT HERE", 150, 80);
              //                    });


              //      var renderOptions = engine.render.options;
              //      renderOptions.background = 'http://brm.io/matter-js-demo-master/img/wall-bg.jpg';
              //      renderOptions.background = '#ffffff';
              //      renderOptions.showAngleIndicator = false;
              //      renderOptions.wireframes = false;

              // run the engine
              Engine.run(engine);
            
              scope.$watch(attrs.ngShow, function(){

                var isShown = scope.$eval(attrs.ngShow);

                if(isShown){

                  // 

                  $log.debug('about to show ' + scope.data.type);
                  utility.setEntryTransition(element, scope.data);
                  savedData = scope.data;
                }
                else if(savedData != null){
                  $log.debug('about to hide ' + savedData.type + ', next type on deck: ' + scope.data.type);
                  utility.setExitTransition(element, savedData);
                  savedData = null;
                }
              });
            
            
            $document.on("click", function(event){
              
              var x = 400, y = 0;
              var body;
              var colorArr = ['red', 'orange', 'blue', 'yellow', 'green'];
              
              if (Common.random() > 0.35) {
                var randDim = Common.random(50, 70);
                body = Bodies.rectangle(x, y, randDim, randDim);
              } 
              else {
                body = Bodies.circle(x, y, Common.random(30,50), {
                    density: 0.0005,
                    frictionAir: 0.06,
                    restitution: 0.3,
                    friction: 0.01,
//                      render: {
//                        fillStyle: Common.choose(colorArr),
//                        fillText: 'test'
//                      }
                });
              }
              
              scope.world.add(scope.engine.world, body);
              $log.debug(scope.engine.world.bodies.length - 4); // don't count borders
              scope.messages.push({id: scope.engine.world.bodies.length + 1, text: 'This is just random text over and over'});
              $('#messageDrop')[0].scrollTop = $('#messageDrop')[0].scrollHeight;
            });
            
          }
        };
    }
})();