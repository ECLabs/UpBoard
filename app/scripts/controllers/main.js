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

    mainCtrl.$inject = ['$firebaseObject', 'Ref', '$timeout', '$log', 'utility'];
    function mainCtrl($firebaseObject, Ref, $timeout, $log, utility) {
        
        var vm = this;
        
        vm.currentIndex = 0;
        vm.loop = true;
        vm.currentSlide;
        vm.logo;
        
        vm.data = $firebaseObject(Ref);
        vm.data.$loaded().then(startSlideShow);
        
        function isEnd(){
            return vm.currentIndex > vm.data.slides.length;
        }
        
        function restart(){
            vm.currentIndex = 0;
            startSlideShow();
        }
        
        function nextSlide(){

            $log.debug(vm.currentSlide);
            
            var slideTime = utility.calculateSlideTime(vm.currentSlide);
            
            var delay = slideTime + vm.currentSlide.timing.transitionTime + 2000;
            $log.debug('delay: ' + delay);
            
            $timeout(function(){

                // get ready to go to next slide
                $timeout(function(){
                    
                    vm.currentSlide = vm.data.slides[vm.currentIndex++];
                    if(!isEnd()) nextSlide();
                    else if(vm.loop) restart();
                    
                }, Number(vm.currentSlide.timing.transitionTime) + 2000);  // compensate for transition slide time
                
                // go to transition slide
                vm.currentSlide = {type:'transition'};
                
            }, slideTime);
        }
        
        function startSlideShow(){
            vm.logo = vm.data.logo;
            vm.currentSlide = vm.data.slides[vm.currentIndex++];
            if(!isEnd()) nextSlide();
        }
    }
    
})();