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

    mainCtrl.$inject = ['$firebaseArray', 'Auth', 'Ref',
                        '$timeout', '$log', '$location', 
                        'hotkeys', 'toaster', 'utility'];
    function mainCtrl($firebaseArray, Auth, Ref,
                      $timeout, $log, $location, 
                      hotkeys, toaster, utility) {
        
        var vm = this;
        
        vm.currentIndex = 0;
        vm.loop = true;
        vm.paused = false;
        vm.activeDeck = null;
        vm.currentSlide = null;
        vm.logo = null;
        vm.timeoutPromises = [];
      
        (function init(){
            var auth = Auth.$getAuth();

            // go to login page 
            if(auth == null) $location.path('/login');

            else{
                // retrieve active slide deck 
                vm.data = $firebaseArray(Ref.child('users/' + auth.uid + '/decks').orderByChild('active').equalTo(true));
                vm.data.$loaded().then(startSlideShow);
            }
          
            // add key controls
            hotkeys.add({
              combo: 'ctrl+space',
              description: 'Pause/Stop slideshow',
              callback: vm.pauseSlideshow = function(){
                
                if(!vm.paused){
                  cancelTimeouts();
                  toaster.pop('error', '', 'Slideshow stopped');
                }
                else toaster.pop('warning', '', 'Slideshow already stopped');
              }
            });
          
            hotkeys.add({
              combo: 'ctrl+e',
              description: 'Resume slideshow',
              callback: vm.resumeSlideshow = function(){

                if(vm.paused){
                  if(isEnd()) vm.currentIndex = 0;
                  startSlideShow();
                  toaster.pop('info', '', 'Slideshow resumed');
                }
                else toaster.pop('warning', '', 'Slideshow already running');
              }
            });
          
            hotkeys.add({
              combo: 'ctrl+r',
              description: 'Restart slideshow',
              callback: vm.restartSlideshow = function(){

                cancelTimeouts();

                vm.timeoutPromises.push($timeout(function(){
                  vm.currentIndex = 0;
                  startSlideShow();
                  toaster.pop('info', '', 'Slideshow restarted');
                }, 500));
              }
            });
          
            hotkeys.add({
              combo: 'ctrl+b',
              description: 'Back to previous slide, slideshow stopped',
              callback: vm.goToPreviousSlide = function(){
                
                cancelTimeouts();
                
                if(vm.currentSlide.slideId !== 0){
                  vm.currentIndex = vm.currentSlide.slideId != null ?
                                    vm.currentSlide.slideId - 1 : vm.currentIndex - 1;
                  setCurrentSlide();
                  toaster.pop('info', '', 'Previous slide');
                }
                else toaster.pop('warning', '', 'First slide');
              }
            });
          
            hotkeys.add({
              combo: 'ctrl+n',
              description: 'Skip to next slide, slideshow stopped',
              callback: vm.goToNextSlide = function(){
                
                cancelTimeouts();
                
                if(!isEnd()) {
                  vm.currentIndex = vm.currentSlide.slideId != null ?
                                    vm.currentSlide.slideId + 1 : vm.currentIndex + 1;
                  setCurrentSlide();
                  toaster.pop('info', '', 'Next slide');
                }
                else toaster.pop('warning', '', 'Last slide');
              }
            });
          
            hotkeys.add({
              combo: 'ctrl+l',
              description: 'Jump to last slide, slideshow stopped',
              callback: vm.goToLastSlide = function(){
                
                cancelTimeouts();
                
                if(!isEnd()){
                  vm.currentIndex = vm.activeDeck.slides.length - 1;
                  setCurrentSlide();
                  toaster.pop('info', '', 'Last slide');
                }
                else toaster.pop('warning', '', 'Last slide already');
              }
            });
          
            hotkeys.add({
              combo: 'ctrl+k',
              description: 'Jump to first slide, slideshow stopped',
              callback: vm.goToFirstSlide = function(){
                
                cancelTimeouts();

                if(vm.currentSlide.slideId === 0){
                  toaster.pop('warning', '', 'First slide already');
                }
                else if(vm.currentIndex !== 0){
                  vm.currentIndex = 0;
                  setCurrentSlide();
                  toaster.pop('info', '', 'First slide');
                }
              }
            });
          
        })();
      
        function cancelTimeouts(){
          
          vm.paused = true; // call first, order seems to matter to get UI updated

          //$log.debug('canceling ' + vm.timeoutPromises.length + ' promises');
          
          // loop through promises and cancel them all
          while(vm.timeoutPromises.length > 0){
            $timeout.cancel(vm.timeoutPromises.pop());
          }
        }
        
        function isEnd(){
            return vm.currentIndex >= vm.activeDeck.slides.length;
        }
        
        function restart(){
            vm.currentIndex = 0;
            nextSlide();
        }
        
        function nextSlide(){

//            $log.debug(vm.currentSlide);
            
            var transitionSlideTime = 2000; // compensate for transition slide time
            var delay = vm.currentSlide.slideTime + vm.currentSlide.timing.transitionTime + transitionSlideTime;
//            $log.debug('delay: ' + delay);
            
            vm.timeoutPromises.push($timeout(function(){

                // get ready to go to next slide
                vm.timeoutPromises.push($timeout(run, Number(vm.currentSlide.timing.transitionTime) + transitionSlideTime));
                
                // go to transition slide
                vm.currentSlide = {type:'transition'};
                
            }, vm.currentSlide.slideTime));
        }

        function setCurrentSlide(){
          
            // pass active deck id and slide id for firebase ref binding
            vm.currentSlide = vm.activeDeck.slides[vm.currentIndex];
            vm.currentSlide.activeDeckId = vm.activeDeck.$id;
            vm.currentSlide.slideId = vm.currentIndex++;
            vm.currentSlide.timeoutPromises = vm.timeoutPromises;
            vm.currentSlide.slideTime = utility.calculateSlideTime(vm.currentSlide);
        }
      
        function run(){
          setCurrentSlide();
          if(!isEnd()) nextSlide();
          else if(vm.loop) restart();
          else vm.paused = true;
        }
        
        function startSlideShow(){
            if(vm.data != null && vm.data[0] != null){
              vm.paused = false;
              vm.activeDeck = vm.data[0];
              vm.logo = vm.activeDeck.logo;
              run();
            }
        }
    }
    
})();