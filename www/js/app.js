// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('confero.app', [
		'ionic', 
		'ngResource', 
		'LocalForageModule',
		'confero.tabs',
		'confero.ConferoDataObjects',
	'confero.ConferoDataService',
		'confero.mainPage', 
		'confero.eventsList', 
		'confero.paperItem', 
		'confero.peopleItem', 
		'confero.sessionItem', 
		'confero.eventsService', 
		'confero.conferenceService', 
		'confero.sessionService', 
		'confero.paperService', 
		'confero.peopleService' 
	]).run(function($ionicPlatform) {
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
}).controller('EventsListCtrl', ['$scope', 'EventsIndex', 
    function($scope, EventsIndex) {
        $scope.locationWWW = 'http://' + location.hostname + ':3000';
        $scope.pastEvents = [];
        $scope.upcomingEvents = [];
        $scope.inProgressEvents = [];
        
        var applyMoment = function(data) {
            angular.forEach(data, function(value, key) {
                var sd = moment(value.momentStartDate);
                value.StartDatePretty = sd.format("MMMM D, YYYY");
                sd = moment(value.momentEndDate);
                value.EndDatePretty = sd.format("MMMM D, YYYY");
            });
        };
		var pastEventsPromise = EventsIndex.Past();
        pastEventsPromise.then(function(data) {
            applyMoment(data);
            $scope.pastEvents = data;
        });
        var upcomingEventsPromise = EventsIndex.UpComing();
        upcomingEventsPromise.then(function(data) {
            applyMoment(data);
            $scope.upcomingEvents = data;
        });
        var inProgressEventsPromise = EventsIndex.InProgress();
        inProgressEventsPromise.then(function(data) {
            applyMoment(data);
            $scope.inProgressEvents = data;
        });
    }
]).controller('TabsCrtl', ['$scope', '$state',
    function($scope, $state, People, ConferenceInfo) {
        $scope.conferenceId = $state.params.id;
        $scope.ConferenceName = "confero";
    }
]).controller('PeopleTabCrtl', ['$scope', '$state', 'People', 'ConferenceInfo',
    function($scope, $state, People, ConferenceInfo) {
        $scope.conferenceId = $state.params.id;
        $scope.ConferenceName = "confero";
        var conferenceConf = ConferenceInfo.get({
            id: $scope.conferenceId
        });
        conferenceConf.$promise.then(function(data) {
            $scope.ConferenceInfo = data;
        });
        var peopleConf = People.query({
            id: $scope.conferenceId
        });
        peopleConf.$promise.then(function(data) {
            angular.forEach(data, function(value, key) {
                value.KeyEncoded = encodeURIComponent(value.Key);
                var name = value.Name.split(/\s/);
                value.firstName = name[0];
                value.lastName = name[name.length - 1];
            });
            data.sort(function(a, b) {
                var s = NaturalSort(a.lastName, b.lastName);
                if(s === 0) {
                    s = NaturalSort(a.firstName, b.firstName);
                }
                return s;
            });
            $scope.people = data;
        });
        $scope.dividerTitle = function($index) {
            return $scope.people[$index].lastName[0];
        };
        $scope.showPeopleDivider = function($index) {
            if(!$scope.people[$index - 1]) {
                return true;
            } else {
                return $scope.people[$index - 1].lastName[0] !== $scope.people[$index].lastName[0];
            }
        };
    }
]).controller('PapersTabCrtl', ['$scope', '$state', 'Papers', 'ConferenceInfo',
    function($scope, $state, Papers, ConferenceInfo) {
        $scope.conferenceId = $state.params.id;
        $scope.ConferenceName = "confero";
        var conferenceConf = ConferenceInfo.get({
            id: $scope.conferenceId
        });
        conferenceConf.$promise.then(function(data) {
            $scope.ConferenceInfo = data;
        });
        var papersConf = Papers.query({
            id: $scope.conferenceId
        });
        papersConf.$promise.then(function(data) {
            angular.forEach(data, function(value, key) {
                value.KeyEncoded = encodeURIComponent(value.Key);
            });
            data.sort(function(a, b) {
                return NaturalSort(a.Title, b.Title);
            });
            $scope.papers = data;
        });
    }
]).controller('SessionsTabCrtl', ['$scope', '$state', 'Sessions', 'ConferenceInfo',
    function($scope, $state, Sessions, ConferenceInfo) {
        $scope.conferenceId = $state.params.id;
        $scope.ConferenceName = "confero";
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
            $scope.sessions = data;
        });
        var conferenceConf = ConferenceInfo.get({
            id: $scope.conferenceId
        });
        conferenceConf.$promise.then(function(data) {
            $scope.ConferenceInfo = data;
        });
    }
]).controller('SessionPageCtrl', ['$scope', '$state', 'Session', 'ConferenceInfo',
    function($scope, $state, Session, ConferenceInfo) {
        $scope.conferenceId = $state.params.id;
        $scope.sessionKey = $state.params.key;
        $scope.items = {};
        var sessionConf = Session.get({
            id: $scope.conferenceId,
            key: $scope.sessionKey
        });
        $scope.starred = false;
        sessionConf.$promise.then(function(data) {
            var t = data.Time.split('-');
            data.StartTime = moment(data.Day + ' ' + t[0].trim(), "YYYY-MM-DD HH:mm");
            data.EndTime = moment(data.Day + ' ' + t[1].trim(), "YYYY-MM-DD HH:mm");
            data.PrettyDateTime = data.StartTime.format("ddd MMMM D[th] HH:mm") + ' - ' + data.EndTime.format("HH:mm");
            data.Colour = 'colour' + (simpleHash(data.Location) % 15);
            $scope.session = data;
        });
        var conferenceConf = ConferenceInfo.get({
            id: $scope.conferenceId
        });
        conferenceConf.$promise.then(function(data) {
            $scope.ConferenceInfo = data;
        });
        $scope.$watch('starred', function(newValue, oldValue) {
            if(newValue) {
                $scope.isStarredStyle = 'ion-ios7-star colorGold';
            } else {
                $scope.isStarredStyle = 'ion-ios7-star-outline';
            }
        });
        $scope.clickStar = function() {
            $scope.starred = !$scope.starred;
        };
    }
]).controller('PaperPageCtrl', ['$scope', '$state', 'Paper', 'ConferenceInfo',
    function($scope, $state, Paper, ConferenceInfo) {
        $scope.conferenceId = $state.params.id;
        $scope.paperKey = $state.params.key;
        $scope.items = {};
        var paperConf = Paper.get({
            id: $scope.conferenceId,
            key: $scope.paperKey
        });
        $scope.starred = false;
        paperConf.$promise.then(function(data) {
            $scope.paperData = data;
            $scope.paperData.urlDOI = decodeURIComponent(data.DOI);
            $scope.paperData.googleScholar = "http://scholar.google.ca/scholar?q=" + data.Authors.join("+").replace("@", "").replace(/\s/g, "+") + '+' + data.Title.replace(/\s/g, '+');
        });
        var conferenceConf = ConferenceInfo.get({
            id: $scope.conferenceId
        });
        conferenceConf.$promise.then(function(data) {
            $scope.ConferenceInfo = data;
        });
        $scope.$watch('starred', function(newValue, oldValue) {
            if(newValue) {
                $scope.isStarredStyle = 'ion-ios7-star colorGold';
            } else {
                $scope.isStarredStyle = 'ion-ios7-star-outline';
            }
        });
        $scope.clickStar = function() {
            $scope.starred = !$scope.starred;
        };
    }
]).controller('PeoplePageCtrl', ['$scope', '$state', 'Person', 'ConferenceInfo', 'SessionsByPersonKey', 'ItemsByPersonKey',
    function($scope, $state, Person, ConferenceInfo, SessionsByPersonKey, ItemsByPersonKey) {
        $scope.conferenceId = $state.params.id;
        $scope.peopleKey = $state.params.key;
     
        var peopleConf = Person.get({
            id: $scope.conferenceId,
            key: $scope.peopleKey
        });
		var peopleSessionsConf = SessionsByPersonKey.query({
            id: $scope.conferenceId,
            key: $scope.peopleKey
        });
		var peopleItemsConf = ItemsByPersonKey.query({
            id: $scope.conferenceId,
            key: $scope.peopleKey
        });

		peopleItemsConf.$promise.then(function(data) {
            $scope.Items = data;

        });
		peopleSessionsConf.$promise.then(function(data) {
            $scope.Sessions = data;
        });

        $scope.starred = false;
        peopleConf.$promise.then(function(data) {
            $scope.peopleData = data;
            $scope.peopleData.googleScholar = "http://scholar.google.ca/scholar?q=" + data.Name.replace(/\s/g, "+") + '+' + data.Affiliation.replace(/\s/g, '+');
        });
        var conferenceConf = ConferenceInfo.get({
            id: $scope.conferenceId
        });
        conferenceConf.$promise.then(function(data) {
            $scope.ConferenceInfo = data;
        });
        $scope.$watch('starred', function(newValue, oldValue) {
            if(newValue) {
                $scope.isStarredStyle = 'ion-ios7-star colorGold';
            } else {
                $scope.isStarredStyle = 'ion-ios7-star-outline';
            }
        });
        $scope.clickStar = function() {
            $scope.starred = !$scope.starred;
        };
    }
]).config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('eventspage', {
        url: "/events-page",
        templateUrl: "events-page.html",
        controller: 'EventsListCtrl'
    }).state('sessionPage', {
        url: "/conference/:id/session/:key",
        templateUrl: "./views/sessionPage.html",
        controller: 'SessionPageCtrl'
    }).state('paperPage', {
        url: "/conference/:id/paper/:key",
        templateUrl: "./views/paperPageView.html",
        controller: 'PaperPageCtrl'
    }).state('peoplePage', {
        url: "/conference/:id/people/:key",
        templateUrl: "./views/peoplePageView.html",
        controller: 'PeoplePageCtrl'
    }).state('tabs', {
        url: '/conference/:id',
        templateUrl: "./views/tabs.html"
    }).state('tabs.sessions', {
        url: '/sessions',
        views: {
            'sessions-tab': {
                templateUrl: "./views/sessionsTab.html",
                controller: "SessionsTabCrtl"
            }
        }
    }).state('tabs.people', {
        url: '/people',
        views: {
            'people-tab': {
                templateUrl: "./views/peopleTab.html",
                controller: "PeopleTabCrtl"
            }
        }
    }).state('tabs.papers', {
        url: '/papers',
        views: {
            'papers-tab': {
                templateUrl: "./views/papersTab.html",
                controller: "PapersTabCrtl"
            }
        }
    });
    $urlRouterProvider.otherwise("/events-page");
});