(function(){
  
  'use strict';

  /**
   * @ngdoc directive
   * @name upBoardApp.directive:ubSlideLoader
   * @description
   * # ubSlideLoader
   */
  angular.module('upBoardApp')
    .directive('ubSlideLoader', ubSlideLoader);

    ubSlideLoader.$inject = ['$log', '$compile', 'utility'];
    function ubSlideLoader($log, $compile, utility) {
      return {
        template: '<div></div>',
        restrict: 'E',
        replace: true,
        scope:{
          deck: '=',
          currentSlide: '='
        },
        link: function postLink(scope, element, attrs) {
          
          // dynamically load directives, pass slide index for ng-show
          scope.$watch(function(){ return scope.deck }, function(){
            
            if(scope.deck != null){

              var htm = '';

              // get slides in deck
              var slides = scope.deck.slides;
              for(var i = 0; i < slides.length; i++){

                var slide = slides[i];
                
                // build tag name with slide type, convert camel cased names to be hyphen separated
                var tag = 'ub-' + utility.camelToHyphen(slide.type);
                htm += '<' + tag + ' data="currentSlide" index="' + i + '"></' + tag + '>';
              }

              var compiled = $compile(htm)(scope);
              element.append(compiled);
            }
          });
        }
      };
    }
  
})();