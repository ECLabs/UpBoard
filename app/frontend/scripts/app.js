'use strict';

/**
 * @ngdoc overview
 * @name upBoardApp
 * @description
 * # upBoardApp
 *
 * Main module of the application.
 */
angular.module('upBoardApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'firebase.ref',
    'firebase.auth',
    'duScroll',
    'toaster',
    'btford.socket-io',
    'cfp.hotkeys',
    'ui.bootstrap',
    'highcharts-ng',
    'leaflet-directive'
  ])

  .config(['$logProvider', function($logProvider){ 
    $logProvider.debugEnabled(true); // set to false for production
  }]);

//  .config(['highchartsNGProvider', function (highchartsNGProvider) {
//    highchartsNGProvider.lazyLoad();
//    highchartsNGProvider.basePath("/scripts/");
//  }]);;