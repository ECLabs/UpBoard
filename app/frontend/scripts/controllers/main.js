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

    mainCtrl.$inject = ['$firebaseArray', 'Auth', 'Ref', '$timeout', '$log', '$location', 'utility'];
    function mainCtrl($firebaseArray, Auth, Ref, $timeout, $log, $location, utility) {
        
        var vm = this;
        
        vm.currentIndex = 0;
        vm.loop = true;
        vm.activeDeck;
        vm.currentSlide;
        vm.logo;
        
        (function init(){
            var auth = Auth.$getAuth();

            // go to login page 
            if(auth == null) $location.path('/login');

            else{
                // retrieve active slide deck 
                vm.data = $firebaseArray(Ref.child('users/' + auth.uid + '/decks').orderByChild('active').equalTo(true));
                vm.data.$loaded().then(startSlideShow);
            }
        })();
        
        function isEnd(){
            return vm.currentIndex > vm.activeDeck.slides.length;
        }
        
        function restart(){
            vm.currentIndex = 0;
            startSlideShow();
        }
        
        function nextSlide(){

//            $log.debug(vm.currentSlide);
            
            var slideTime = utility.calculateSlideTime(vm.currentSlide);
            
            var delay = slideTime + vm.currentSlide.timing.transitionTime + 2000;
//            $log.debug('delay: ' + delay);
            
            $timeout(function(){

                // get ready to go to next slide
                $timeout(function(){
                    
                    vm.currentSlide = vm.activeDeck.slides[vm.currentIndex++];
                    if(!isEnd()) nextSlide();
                    else if(vm.loop) restart();
                    
                }, Number(vm.currentSlide.timing.transitionTime) + 2000);  // compensate for transition slide time
                
                // go to transition slide
                vm.currentSlide = {type:'transition'};
                
            }, slideTime);
        }
        
        function startSlideShow(){
            if(vm.data != null && vm.data[0] != null){
                
                vm.activeDeck = vm.data[0];
//                $log.debug(vm.activeDeck);
                
                vm.logo = vm.activeDeck.logo;
                vm.currentSlide = vm.activeDeck.slides[vm.currentIndex++];
                if(!isEnd()) nextSlide();
            }
        }
    }
    
})();