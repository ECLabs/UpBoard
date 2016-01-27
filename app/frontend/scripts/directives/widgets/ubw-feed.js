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
        header: '@', 
        sources: '@', // comma delimited string of sources
        colors: '@',  // comma delimited string of source text colors
        event: '@'   // socket event to listen on
      },
      link: function postLink(scope, element, attrs) {

        var defaultColor = '#ffffff';
        
        var sourceArr = scope.sources.split(',');
        var colorArr = scope.colors.split(',');

        scope.messages = [];
        
        ubSocketIo.on(scope.event, function(data){
          
          var index = sourceArr.indexOf(data.source);
          
          // use respective color if it exists
          var color = colorArr[index] != null ? colorArr[index] : defaultColor;
          
          scope.messages.push({id: scope.messages.length + 1,
                               text: data.source + ' - ' + data.content,
                               color: color});
        });

      }
    };
  }
  
})();