// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('confero.app', [ 
	'ionic', 
	'ngResource',
	'confero.header',
	'confero.tabs',
	'confero.eventsService'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('EventsListCtrl', ['$scope', 'Events', function($scope, Events) {
	$scope.events = Events.get();
	console.log('Events',$scope.events);
}]);

/*
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "./views/tabs.html"
    })
    .state('tabs.session', {
      url: "/session",
      views: {
        'session-tab': {
          templateUrl: "./views/sessionsTab.html",
          controller: 'HomeTabCtrl'
        }
      }
    })
.state('tabs.custom', {
      url: "/custom",
      views: {
        'custom-tab': {
          templateUrl: "./views/customTab.html",
          controller: 'HomeTabCtrl'
        }
      }
    })
  .state('tabs.people', {
      url: "/people",
      views: {
        'people-tab': {
          templateUrl: "./views/peopleTab.html",
          controller: 'HomeTabCtrl'
        }
      }
    })
  .state('tabs.papers', {
      url: "/papers",
      views: {
        'papers-tab': {
          templateUrl: "./views/papersTab.html",
          controller: 'HomeTabCtrl'
        }
      }
    });
})*/
