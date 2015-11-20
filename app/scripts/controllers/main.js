(function(){
   'use strict';

    /**
     * @ngdoc function
     * @name upBoardApp.controller:MainCtrl
     * @description
     * # MainCtrl
     * Controller of the upBoardApp
     */
    angular.module('upBoardApp')
      .controller('MainCtrl', mainCtrl);

    mainCtrl.$inject = ['$firebaseArray', 'Ref', '$timeout', '$log', '$compile', '$scope'];
    function mainCtrl($firebaseArray, Ref, $timeout, $log, $compile, $scope) {
        
        var vm = this;
        
        vm.currentIndex = 0;
        vm.loop = true;
        vm.currentSlide;
        vm.nextSlide; // slide on deck
//        vm.data;
        
        vm.slides = $firebaseArray(Ref);
//        vm.slides.$loaded().then(loadSlideShow);
        vm.slides.$loaded().then(startSlideShow);
        
//
//            // dynamically add slide types
//            for(var i = 0; i < vm.slides.length; i++){
//                var slide = vm.slides[i];
//                vm.data = slide;
//                var el = document.createElement(slide.type);
//                var slideDirective = angular.element(el);
//                
//                //$scope.data = slide;
//                //var slideDirective = '<' + slide.type + ' data="' + slide + '"></' + slide.type + '>';
//                
//                $compile( slideDirective )( $scope );
//                angular.element('#slideshow').append(slideDirective);
//            }
//            startSlideShow();
//        }
        
        function isEnd(){
            return vm.currentIndex > vm.slides.length;
        }
        
        function restart(){
            vm.currentIndex = 0;
            startSlideShow();
        }
        
        function nextSlide(){
            
            
            var delay = vm.currentSlide.timing.slideTime + (Number(vm.currentSlide.timing.transitionTime) * 2);
            $log.debug('delay: ' + delay);
            $timeout(function(){

//                vm.nextSlide = vm.slides[vm.currentIndex];
                
                //$(vm.currentSlide.type).addClass("ub-" + vm.currentSlide.transitions.exit)
                //$('#ub-' + vm.currentSlide.type).addClass('ng-hide');
                console.log('initiate hide');
                
                
                //$('.container').fadeOut('slow');
                
                $timeout(function(){
                    
                    //$('.container').show();
                    vm.currentSlide = vm.slides[vm.currentIndex++];
                    if(!isEnd()) {
//                        vm.nextSlide = vm.slides[vm.currentIndex];
                        nextSlide();
                    }
                    else if(vm.loop) restart();
                }, Number(vm.currentSlide.timing.transitionTime) + 2000);  // compensate for transition slide time
                
                vm.currentSlide = {type:'transition'};
                
            }, vm.currentSlide.timing.slideTime);
//                }, delay);
        }
        
        function startSlideShow(){
//            var slides = angular.element('#slideshow').children();
//            console.log(slides.length);
//            
//            for(var i = 0; i < slides.length; i++){
//                console.log(slides[i]);
//            }
            vm.currentSlide = vm.slides[vm.currentIndex++];
            
            // don't move on if only one slide
            if(!isEnd()) {
//                vm.nextSlide = vm.slides[vm.currentIndex];
                nextSlide();
            }
//            vm.currentSlide = slides[vm.currentIndex++];
            
        }
    }
    
})();