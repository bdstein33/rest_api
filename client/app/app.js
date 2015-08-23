(function() {
  'use strict';
  angular.module('smstudios', [
    // Angular libaries
    'ui.router',

    // Componenets
    'landingController',
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
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('landing', {
        url: '/',
        authenticate: false,
        views: {
          content: {
            templateUrl: 'app/components/landing/landing.html',
            controller: 'landingController'
          }
        }
      })
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
        // resolve: {
        //   redirectIfLoggedIn: function() {

        //   }
        // }
      }).state('home', {
        url: '/private/home',
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
    /* If user is not logged in, redirect to home page if private is not in url, otherwise redirect to login */
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      authFactory.loggedIn(function(status) {
        if (toState.authenticate && !status) {
          $location.path('landing');
        } else if (toState.redirect && status) {
          $location.path('private/home');
        } else if (toState.authenticate) {
          $('#topnav').show();
        }
      });

    });
    
  }
})();