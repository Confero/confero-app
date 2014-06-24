// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('confero.app', ['ionic', 'ngResource', 'confero.header', 'confero.tabs', 'confero.mainPage', 'confero.eventsList', 'confero.eventsService', 'confero.conferenceService']).run(function($ionicPlatform) {
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
}).controller('EventsListCtrl', ['$scope', 'PastEvents', 'InProgressEvents', 'UpcomingEvents',
    function($scope, PastEvents, InProgressEvents, UpcomingEvents) {
        $scope.locationWWW = 'http://' + location.hostname + ':3000';
        $scope.pastEvents = [];
        $scope.upcomingEvents = [];
        $scope.inProgressEvents = [];
        var pastEventsPromise = PastEvents.query();
        var applyMoment = function(data) {
            angular.forEach(data, function(value, key) {
                var sd = moment(value.momentStartDate);
                value.StartDatePretty = sd.format("MMMM D, YYYY");
                sd = moment(value.momentEndDate);
                value.EndDatePretty = sd.format("MMMM D, YYYY");
            });
        };
        pastEventsPromise.$promise.then(function(data) {
            applyMoment(data);
            $scope.pastEvents = data;
        });
        var upcomingEventsPromise = UpcomingEvents.query();
        upcomingEventsPromise.$promise.then(function(data) {
            applyMoment(data);
            $scope.upcomingEvents = data;
        });
        var inProgressEventsPromise = InProgressEvents.query();
        inProgressEventsPromise.$promise.then(function(data) {
            applyMoment(data);
            $scope.inProgressEvents = data;
        });
    }
]).controller('ConferenceTabCrtl', ['$scope', '$state', 'Sessions',
    function($scope, $state, Sessions) {
        $scope.conferenceId = $state.params.id;
        var sessionsConf = Sessions.query({
            id: $scope.conferenceId
        });
        $scope.showSessionDivider = function(index) {
            if($scope.sessions) {
                if(index === 0) {
                    return true;
                } else {
                    if($scope.sessions[index] && $scope.sessions[index - 1]) {
                        return $scope.sessions[index].PrettyDateTime !== $scope.sessions[index - 1].PrettyDateTime;
                    }
                }
            }
        };
        sessionsConf.$promise.then(function(data) {
            angular.forEach(data, function(value, key) {
                value.KeyEncoded = encodeURIComponent(value.Key);
                var time = value.Time.split('-');
                value.StartTime = moment(value.Day + ' ' + time[0].trim(), 'YYYY-MM-DD HH:mm');
                value.EndTime = moment(value.Day + ' ' + time[1].trim(), 'YYYY-MM-DD HH:mm');
                value.PrettyDate = value.StartTime.format("dddd MMMM D[th]");
                value.PrettyDateTime = value.StartTime.format("ddd MMMM D[th] HH:mm") + ' - ' + value.EndTime.format("HH:mm");
				value.PrettyDateTimeFull = value.StartTime.format("dddd MMMM D[th] HH:mm") + ' - ' + value.EndTime.format("HH:mm");
                value.Colour = 'colour' + (simpleHash(value.Location) % 15);
            });
            $scope.sessions = data;
        });
    }
]).config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('eventspage', {
        url: "/events-page",
        templateUrl: "events-page.html",
        controller: 'EventsListCtrl'
    }).state('tabs', {
        url: '/conference/:id',
        templateUrl: "./views/tabs.html"
    }).state('tabs.sessions', {
        url: '/sessions',
        views: {
            'sessions-tab': {
                templateUrl: "./views/sessionsTab.html",
                controller: "ConferenceTabCrtl"
            }
        }
    });
    $urlRouterProvider.otherwise("/events-page");
    /* .state('tabs.session', {
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
    });*/
});