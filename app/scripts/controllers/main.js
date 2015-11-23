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

    mainCtrl.$inject = ['$firebaseArray', 'Ref', '$timeout', '$log'];
    function mainCtrl($firebaseArray, Ref, $timeout, $log) {
        
        var vm = this;
        
        vm.currentIndex = 0;
        vm.loop = true;
        vm.currentSlide;
        
        vm.slides = $firebaseArray(Ref);
        vm.slides.$loaded().then(startSlideShow);
        
        function isEnd(){
            return vm.currentIndex > vm.slides.length;
        }
        
        function restart(){
            vm.currentIndex = 0;
            startSlideShow();
        }
        
        function nextSlide(){

            $log.debug(vm.currentSlide);
            
            var delay = vm.currentSlide.timing.slideTime + vm.currentSlide.timing.transitionTime + 2000;
            $log.debug('delay: ' + delay);
            
            $timeout(function(){

//                $log.debug('initiate hide');
                
                $timeout(function(){
                    
                    vm.currentSlide = vm.slides[vm.currentIndex++];
                    if(!isEnd()) nextSlide();
                    else if(vm.loop) restart();
                    
                }, Number(vm.currentSlide.timing.transitionTime) + 2000);  // compensate for transition slide time
                
                // go to transition slide
                vm.currentSlide = {type:'transition'};
                
            }, vm.currentSlide.timing.slideTime);
        }
        
        function startSlideShow(){

            vm.currentSlide = vm.slides[vm.currentIndex++];
            if(!isEnd()) nextSlide();
        }
    }
    
})();