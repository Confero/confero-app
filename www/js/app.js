// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('confero.app', [ 
	'ionic', 
	'ngResource',
	'confero.header',
	'confero.tabs',
	'confero.mainPage',
	'confero.eventsList',
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

.controller('EventsListCtrl', ['$scope', 'PastEvents', 'InProgressEvents', 'UpcomingEvents', 
			function($scope, PastEvents, InProgressEvents, UpcomingEvents) {
				
	$scope.locationWWW = 'http://'+ location.hostname + ':3000';
	$scope.pastEvents = [];
	$scope.upcomingEvents = [];
	$scope.inProgressEvents = [];
	
	var pastEventsPromise = PastEvents.query();
	pastEventsPromise.$promise.then(function(data) {
		
		angular.forEach(data, function(value, key){
			var sd = moment(value.momentStartDate);
			value.StartDatePretty = sd.format("MMMM D, YYYY");
			sd = moment( value.momentEndDate );
			value.EndDatePretty = sd.format("MMMM D, YYYY");
		});
		$scope.pastEvents = data;
	});
				
	var upcomingEventsPromise = UpcomingEvents.query();
		upcomingEventsPromise.$promise.then(function(data) {
		
		angular.forEach(data, function(value, key){
			var sd = moment(value.momentStartDate);
			value.StartDatePretty = sd.format("MMMM D, YYYY");
			sd = moment( value.momentEndDate );
			value.EndDatePretty = sd.format("MMMM D, YYYY");
		});
		$scope.upcomingEvents = data;
	});
				
	var inProgressEventsPromise = InProgressEvents.query();
	inProgressEventsPromise.$promise.then(function(data) {
		
		angular.forEach(data, function(value, key){
			var sd = moment(value.momentStartDate);
			value.StartDatePretty = sd.format("MMMM D, YYYY");
			sd = moment( value.momentEndDate );
			value.EndDatePretty = sd.format("MMMM D, YYYY");
		});
		$scope.inProgressEvents = data;
	});
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
