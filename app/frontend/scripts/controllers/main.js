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
              callback: function(){
                
                if(vm.timeoutPromises.length > 0){
                  cancelTimeouts();
                  toaster.pop('error', '', 'Slideshow stopped');
                }
                else toaster.pop('warning', '', 'Slideshow already stopped');
              }
            });
          
            hotkeys.add({
              combo: 'ctrl+enter',
              description: 'Resume slideshow',
              callback: function(){

                if(vm.timeoutPromises.length === 0){

                  if(!isEnd()) nextSlide();
                  else if(vm.loop) restart();
                  toaster.pop('info', '', 'Slideshow resumed');
                }
                else toaster.pop('warning', '', 'Slideshow already running');
              }
            });
          
            hotkeys.add({
              combo: 'ctrl+r',
              description: 'Restart slideshow',
              callback: function(){
                cancelTimeouts();
                restart();
                toaster.pop('info', '', 'Slideshow restarted');
              }
            });
          
            hotkeys.add({
              combo: 'ctrl+b',
              description: 'Back to previous slide, slideshow stopped',
              callback: function(){
                
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
              callback: function(){
                
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
              callback: function(){
                
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
              callback: function(){
                
                cancelTimeouts();

                if(vm.currentSlide.slideId !== 0){
                  vm.currentIndex = 0;
                  setCurrentSlide();
                  toaster.pop('info', '', 'First slide');
                }
                else toaster.pop('warning', '', 'First slide already');
              }
            });
          
        })();
      
        function cancelTimeouts(){
          
          $log.debug('canceling ' + vm.timeoutPromises.length + ' promises');
          
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
            
            var slideTime = utility.calculateSlideTime(vm.currentSlide);
            
            var delay = slideTime + vm.currentSlide.timing.transitionTime + 2000;
//            $log.debug('delay: ' + delay);
            
            vm.timeoutPromises.push($timeout(function(){

                // get ready to go to next slide
                vm.timeoutPromises.push($timeout(function(){
                    
                    setCurrentSlide();
                    if(!isEnd()) nextSlide();
                    else if(vm.loop) restart();
                    
                }, Number(vm.currentSlide.timing.transitionTime) + 2000));  // compensate for transition slide time
                
                // go to transition slide
                vm.currentSlide = {type:'transition'};
                
            }, slideTime));
        }
      
        function setCurrentSlide(){
          
            // pass active deck id and slide id for firebase ref binding
            vm.currentSlide = vm.activeDeck.slides[vm.currentIndex];
            vm.currentSlide.activeDeckId = vm.activeDeck.$id;
            vm.currentSlide.slideId = vm.currentIndex++;
            vm.currentSlide.timeoutPromises = vm.timeoutPromises;
        }
        
        function startSlideShow(){
            if(vm.data != null && vm.data[0] != null){
                
              vm.activeDeck = vm.data[0];
              vm.logo = vm.activeDeck.logo;
              
              setCurrentSlide();
              if(!isEnd()) nextSlide();
            }
        }
    }
    
})();