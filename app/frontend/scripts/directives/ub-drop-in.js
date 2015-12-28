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
    
    dropIn.$inject = ['$log', '$timeout', '$document', 'utility'];
    function dropIn($log, $timeout, $document, utility) {
        return {
          templateUrl: '/app/frontend/scripts/directives/ub-drop-in.tpl.html',
          restrict: 'E',
          replace: true,
          scope:{
              data: '=',
              index: '@'
          },
          link: function(scope, element, attrs){

              var savedData; // use to remember for exit transition
              scope.messages = [];
            
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
                          c.fillText(part.id - 5, part.position.x, part.position.y);
                      }
                  }
              };
            
              // create a Matter.js engine, use CustomRender
              var engine = Engine.create(element.find('.ub-drop-in-point')[0], {
                render: {
                  controller: CustomRender,
                  options: {
                    showAngleIndicator: false,
                    wireframes: false,
                    background: '#ffffff',
                    showIds: true
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

              // static walls will not be rendered due to options setting
              World.add(engine.world, [
                  Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 5, options),
                  Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 5, options),
                  Bodies.rectangle(800 + offset, 300, 5, 600.5 + 2 * offset, options),
                  Bodies.rectangle(-offset, 300, 5, 600.5 + 2 * offset, options)
              ]);

              scope.engine = engine;
              scope.world = World;
              scope.bodies = Bodies;

              // run the engine
              Engine.run(engine);
            
              scope.$watch(attrs.ngShow, function(){

                var isShown = scope.$eval(attrs.ngShow);

                if(isShown){
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
            
            
            $document.on('click', function(event){
              
              var x = 400, y = 0;
              var body;
              
              var colorArr = ['#CF4858','#F6624A','#1B6A81','#16A79D',
                              '#80628B','#DC557A','#F4AC42','#4F8598','#69B1CB'];
              
              var fillColor = Common.choose(colorArr);
              
              // TODO add another random polygon
              if (Common.random() > 0.35) {
                var randDim = Common.random(50, 70);
                body = Bodies.rectangle(x, y, randDim, randDim,{
                  render:{
                    fillStyle: fillColor,
                    strokeStyle: '#ffffff'
                  }
                });
              } 
              else {
                body = Bodies.circle(x, y, Common.random(30,50), {
                    density: 0.0005,
                    frictionAir: 0.06,
                    restitution: 0.3,
                    friction: 0.01,
                    render:{
                      fillStyle: fillColor,
                      strokeStyle: '#ffffff'
                    }
                });
              }
              
              scope.world.add(scope.engine.world, body);
              $log.debug(scope.engine.world.bodies.length - 4); // don't count borders
              scope.messages.push({id: scope.engine.world.bodies.length - 4, 
                                   text: 'This is just random text over and over', 
                                   color:fillColor});
              $timeout(function(){
                element.find('.ub-drop-in-message')[0].scrollTop = 0;
              }, 500);
            });
            
          }
        };
    }
})();