(function() {
  'use strict';
  angular.module('mealenders', [
    // Angular libaries
    'ui.router',

    // Componenets
    'loginController',
    'homeController',

    // Shared
    'authFactory',
    'topnavDirective'
  ])
  .config(config)
  .run(run);

  config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];


  function config($stateProvider, $urlRouterProvider, $locationProvider, $state) {
    
    $locationProvider.html5Mode(true);
    // Default to index view if the URL loaded is not found
    $urlRouterProvider.otherwise('/login');

    $stateProvider
      .state('login', {
        url: '/login',
        authenticate: false,
        redirect: true,
        views: {
          content: {
            templateUrl: 'app/components/login/login.html',
            controller: 'loginController'
          }
        }
      }).state('home', {
        url: '/home',
        authenticate: true,
        views: {
          content: {
            templateUrl: 'app/components/home/home.html',
            controller: 'homeController'
          }
        }
      });
  }

  function run($rootScope, $state, authFactory, topnavDirective, $location) {
    // If user is not logged in, redirect to home page if private is not in url, otherwise redirect to login 
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      authFactory.loggedIn(function(status) {
        // If state requires authentication and user is not authenticated, redirect to landing
        if (toState.authenticate && !status) {
          $location.path('landing');
        // If state should redirect if user is logged in and user is logged in
        } else if (toState.redirect && status) {
          $location.path('home');
        // Else show top nav
        } else if (toState.authenticate) {
          $('#topnav').show();
        }
      });
    });
  }
})();