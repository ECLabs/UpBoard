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

    mainCtrl.$inject = ['$firebaseArray', 'Ref', '$timeout', '$log', 'utility'];
    function mainCtrl($firebaseArray, Ref, $timeout, $log, utility) {
        
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
            
            var slideTime = utility.calculateSlideTime(vm.currentSlide);
            
            // TODO - remove this temporary time!!
            //slideTime = 10000;
            
            var delay = slideTime + vm.currentSlide.timing.transitionTime + 2000;
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
                
            }, slideTime);
        }
        
        function startSlideShow(){

            vm.currentSlide = vm.slides[vm.currentIndex++];
            //if(!isEnd()) nextSlide();
        }
    }
    
})();