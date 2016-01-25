(function(){
  
  
  'use strict';

  /**
   * @ngdoc directive
   * @name upBoardApp.directive:ubwFeed
   * @description
   * # ubwFeed
   */
  angular.module('upBoardApp')
    .directive('ubwFeed', ubwFeed);
  
  ubwFeed.$inject = ['$log', 'ubSocketIo'];
  function ubwFeed ($log, ubSocketIo) {
    return {
      templateUrl: '/app/frontend/scripts/directives/widgets/ubw-feed.tpl.html',
      restrict: 'E',
      replace: true,
      scope:{
        data: '='
      },
      link: function postLink(scope, element, attrs) {
        //element.text('this is the ubwFeed directive');

        scope.messages = [];
        
        ubSocketIo.on('testEvent', function(data){
          
          var fillColor = data.source === 'twitter' ? '#81cdff' :
                          data.source === 'reddit'  ? '#fa7f53' :
                          '#81cdff';

          scope.messages.push({id: scope.messages.length + 1,
                               text: data.source + ' - ' + data.content,
                               color:fillColor});
        });

      }
    };
  }
  
})();