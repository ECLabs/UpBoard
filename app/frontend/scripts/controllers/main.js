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
                        '$timeout', '$log', '$location', '$window',
                        'hotkeys', 'toaster', 'ubSocketIo', 'utility'];
    function mainCtrl($firebaseArray, Auth, Ref,
                      $timeout, $log, $location, $window,
                      hotkeys, toaster, ubSocketIo, utility) {
        
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
          
            // add slide controls
            hotkeys.add({
              combo: 'ctrl+space',
              description: 'Pause/Stop slideshow',
              callback: vm.pauseSlideshow = function(){
                
                if(!vm.paused){
                  cancelTimeouts();

                  // slide duration left may be from a previous pause
                  var duration = vm.currentSlide.remainingTime != null ?
                                 vm.currentSlide.remainingTime :
                                 vm.currentSlide.slideTime;

                  vm.currentSlide.remainingTime = duration - (new Date().getTime() - vm.currentSlide.startTime);
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
                  if(vm.currentSlide.slideId != null) vm.currentIndex = vm.currentSlide.slideId;
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
                clearRemainingTime();

                vm.currentIndex = 0;

                vm.timeoutPromises.push($timeout(function(){
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
                clearRemainingTime();
                
                if(vm.currentSlide.slideId !== 0){
                  vm.currentIndex = vm.currentSlide.slideId != null ?
                                    vm.currentSlide.slideId - 1 : vm.currentIndex - 1;

                  setCurrentSlide(true);
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
                clearRemainingTime();
                
                // check to make sure the next slide exists
                if(!isEnd()) {

                  if(vm.currentSlide.slideId != null && !isEnd(vm.currentSlide.slideId + 1)) {
                     vm.currentIndex = vm.currentSlide.slideId + 1;
                  }
                  setCurrentSlide(true);
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
                clearRemainingTime();
                
                if(!isEnd()){
                  vm.currentIndex = vm.activeDeck.slides.length - 1;
                  setCurrentSlide(true);
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
                clearRemainingTime();

                if(vm.currentSlide.slideId === 0){
                  toaster.pop('warning', '', 'First slide already');
                }
                else {
                  vm.currentIndex = 0;
                  setCurrentSlide(true);
                  toaster.pop('info', '', 'First slide');
                }
              }
            });

            // user has switched windows/tabs, pause the slideshow
            function handleBlur(){
              vm.pauseSlideshow();
            }

            angular.element( $window ).on( "blur", handleBlur );
          
        })();
      
        function cancelTimeouts(){
          
          vm.paused = true;

          //$log.debug('canceling ' + vm.timeoutPromises.length + ' promises');
          
          // loop through promises and cancel them all
          while(vm.timeoutPromises.length > 0){
            $timeout.cancel(vm.timeoutPromises.shift());
          }
        }

        function clearRemainingTime(){
            vm.currentSlide.remainingTime = null;
        }

        function isEnd(index){
            var compareIndex = index != null ? index : vm.currentIndex;
            return compareIndex > vm.activeDeck.slides.length - 1;
        }

        function restart(){
            vm.currentIndex = 0;
            nextSlide();
        }

        function nextSlide(){

            var slideDelay = vm.currentSlide.remainingTime != null ?
                             vm.currentSlide.remainingTime : vm.currentSlide.slideTime;

            var transitionSlideTime = 2000; // compensate for transition slide time
            var transitionDelay = Number(vm.currentSlide.timing.transitionTime) + transitionSlideTime;

            vm.timeoutPromises.push($timeout(function(){

                // get ready to go to next slide
                vm.timeoutPromises.push($timeout(run, transitionDelay));

                clearRemainingTime();

                // go to transition slide
                vm.currentSlide = {type:'transition'};

            }, slideDelay));
        }

        function setCurrentSlide(){

            // remove all socket listeners when switching slides, important for performance
            //ubSocketIo.removeAllListeners();
          
            vm.currentSlide = vm.activeDeck.slides[vm.currentIndex];

            // pass active deck id and slide id for firebase ref binding
            vm.currentSlide.activeDeckId = vm.activeDeck.$id;
            vm.currentSlide.slideId = vm.currentIndex++;

            // capture slide start time to determine remaining time if/when paused
            vm.currentSlide.startTime = new Date().getTime();
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