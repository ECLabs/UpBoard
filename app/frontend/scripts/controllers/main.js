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
                cancelTimeouts();
                toaster.pop('error', '', 'Slideshow stopped');
              }
            });
          
            hotkeys.add({
              combo: 'ctrl+enter',
              description: 'Resume slideshow',
              callback: function(){
                startSlideShow();
                toaster.pop('info', '', 'Slideshow resumed');
              }
            });
          
            hotkeys.add({
              combo: 'ctrl+r',
              description: 'Restart slideshow',
              callback: function(){
                cancelTimeouts();
                vm.currentIndex = 0;
                goToTransitionSlide();
                $timeout(function(){startSlideShow();},1000);
                toaster.pop('info', '', 'Slideshow restarted');
              }
            });
          
            hotkeys.add({
              combo: 'ctrl+b',
              description: 'Back to previous slide, slideshow stopped',
              callback: function(){
                
                cancelTimeouts();
                
                if(vm.currentSlide.slideId !== 0){
                  vm.currentIndex = vm.currentSlide.slideId - 1;
                  goToTransitionSlide();
                  $timeout(function(){setCurrentSlide();},1000);
                  toaster.pop('info', '', 'Previous slide');
                }
                else{
                  toaster.pop('warning', '', 'First slide');
                }
              }
            });
          
            hotkeys.add({
              combo: 'ctrl+n',
              description: 'Skip to next slide, slideshow stopped',
              callback: function(){
                
                cancelTimeouts();
                
                if(!isEnd()) {
                  vm.currentIndex = vm.currentSlide.slideId + 1;
                  goToTransitionSlide();
                  $timeout(function(){setCurrentSlide();},1000);
                  toaster.pop('info', '', 'Next slide');
                }
                else{
                  toaster.pop('warning', '', 'Last slide');
                }
              }
            });
          
            hotkeys.add({
              combo: 'ctrl+l',
              description: 'Jump to last slide, slideshow stopped',
              callback: function(){
                
                cancelTimeouts();
                
                if(!isEnd()){
                  vm.currentIndex = vm.activeDeck.slides.length - 1;
                  goToTransitionSlide();
                  $timeout(function(){setCurrentSlide();},1000);
                  toaster.pop('info', '', 'Last slide');
                }
                else{
                  toaster.pop('warning', '', 'Last slide already');
                }
              }
            });
          
            hotkeys.add({
              combo: 'ctrl+k',
              description: 'Jump to first slide, slideshow stopped',
              callback: function(){
                
                cancelTimeouts();

                if(vm.currentSlide.slideId !== 0){
                  vm.currentIndex = 0;
                  goToTransitionSlide();
                  $timeout(function(){setCurrentSlide();},1000);
                  toaster.pop('info', '', 'First slide');
                }
                else{
                  toaster.pop('warning', '', 'First slide already');
                }
              }
            });
          
        })();
      
        function goToTransitionSlide(){
          
          // displays white screen and clears out data in ub-footer
          vm.currentSlide = {type:'transition'};
        }
      
        function cancelTimeouts(){
          
          // loop through promises and cancel them all
          for(var i = 0; i < vm.timeoutPromises.length; i++){
            $timeout.cancel(vm.timeoutPromises[i]);
          }
          
          // TODO cancel current slide's timeouts (bioPanels)
          // vm.currentSlide.cancelTimeouts(); 
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
                
                goToTransitionSlide();
                
            }, slideTime));
        }
      
        function setCurrentSlide(){
          
            // pass active deck id and slide id for firebase ref binding
            vm.currentSlide = vm.activeDeck.slides[vm.currentIndex];
            vm.currentSlide.activeDeckId = vm.activeDeck.$id;
            vm.currentSlide.slideId = vm.currentIndex++;
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