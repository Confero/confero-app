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
	'confero.EventsService', 
	'confero.ConferenceService', 
	'confero.SessionService', 
	'confero.PaperService', 
	'confero.PeopleService' ])
.constant('$ionicLoadingConfig', {
  template: '<h1><i class="icon ion-loading-a"></i>Loading...</h1>'
})
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
.config(['$localForageProvider', function($localForageProvider){
    $localForageProvider.config({
        driver      : 'localStorageWrapper', // if you want to force a driver
        name        : 'Confero', // name of the database and prefix for your data
        version     : 1.0, // version of the database, you shouldn't have to use this
        storeName   : 'conferoData', // name of the table
        description : 'Confero data store'
    });
	$localForageProvider.setNotify(true, true); 
}])

.controller('EventsListCtrl', ['$scope', 'EventsIndex',
    function($scope, EventsIndex) {
        $scope.locationWWW = 'http://' + location.hostname + ':3000';
        $scope.pastEvents = [];
        $scope.upcomingEvents = [];
        $scope.inProgressEvents = [];
       
        EventsIndex.Past().then(function(data) {
            $scope.pastEvents = data;
        });
        
		EventsIndex.UpComing().then(function(data) {
            $scope.upcomingEvents = data;
        });
        EventsIndex.InProgress().then(function(data) {
            $scope.inProgressEvents = data;
        });
    }
]).controller('TabsCrtl', ['$scope', '$state', '$ionicLoading',
    function($scope, $state, $ionicLoading) {
        $scope.conferenceId = $state.params.id;
        $scope.ConferenceName = "confero";
		$ionicLoading.show();
		$scope.$on('loadingFinished', function(ngLoadEvent) {
			$ionicLoading.hide();
		});
    }
]).controller('PeopleTabCrtl', ['$scope', '$state', 'Conference', '$ionicLoading',
    function($scope, $state, Conference, $ionicLoading) {
		$ionicLoading.show();
        $scope.conferenceId = $state.params.id;
        $scope.ConferenceName = "confero";
        Conference.Info($scope.conferenceId).then(function(data) {
            $scope.ConferenceInfo = data;
        });
        Conference.People($scope.conferenceId).then(function(data) {
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
]).controller('PapersTabCrtl', ['$scope', '$state', 'Conference', '$ionicLoading',
    function($scope, $state, Conference, $ionicLoading) {
		$ionicLoading.show();
        $scope.conferenceId = $state.params.id;
        $scope.ConferenceName = "confero";
        Conference.Info($scope.conferenceId).then(function(data) {
            $scope.ConferenceInfo = data;
        });
        Conference.Papers($scope.conferenceId).then(function(data) {
            angular.forEach(data, function(value, key) {
                value.KeyEncoded = encodeURIComponent(value.Key);
            });
            data.sort(function(a, b) {
                return NaturalSort(a.Title, b.Title);
            });
            $scope.papers = data;
        });
    }
]).controller('SessionsTabCrtl', ['$scope', '$state', 'Conference', '$ionicLoading',
    function($scope, $state, Conference, $ionicLoading) {
        $ionicLoading.show();
		$scope.conferenceId = $state.params.id;
        $scope.ConferenceName = "confero";
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
		
		Conference
			.Sessions($scope.conferenceId)
        	.then(function(data) {
            	$scope.sessions = data;
        	});
         
		Conference
			.Info($scope.conferenceId)
        	.then(function(data) {
          	  $scope.ConferenceInfo = data;
       	 });
    }
]).controller('SessionPageCtrl', ['$scope', '$state', 'Session', 'Conference',
    function($scope, $state, Session, Conference) {
        $scope.conferenceId = $state.params.id;
        $scope.sessionKey = $state.params.key;
        $scope.items = {};
        $scope.starred = false;
        
		Session
			.get($scope.conferenceId, $scope.sessionKey)
			.then(function(data) {
            	var t = data.Time.split('-');
           		data.StartTime = moment(data.Day + ' ' + t[0].trim(), "YYYY-MM-DD HH:mm");
            	data.EndTime = moment(data.Day + ' ' + t[1].trim(), "YYYY-MM-DD HH:mm");
            	data.PrettyDateTime = data.StartTime.format("ddd MMMM D[th] HH:mm") + ' - ' + data.EndTime.format("HH:mm");
            	data.Colour = 'colour' + (simpleHash(data.Location) % 15);
            	$scope.session = data;
        });
        
		Conference
			.Info($scope.conferenceId)
			.then(function(data) {
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
]).controller('PaperPageCtrl', ['$scope', '$state', 'Paper', 'Conference',
    function($scope, $state, Paper, Conference) {
        $scope.conferenceId = $state.params.id;
        $scope.paperKey = $state.params.key;
        $scope.items = {};
		$scope.starred = false;
        
		Paper
			.get($scope.conferenceId, $scope.paperKey)
       		.then(function(data) {
            	$scope.paperData = data;
            	$scope.paperData.urlDOI = decodeURIComponent(data.DOI);
            	$scope.paperData.googleScholar = "http://scholar.google.ca/scholar?q=" + data.Authors.join("+").replace("@", "").replace(/\s/g, "+") + '+' + data.Title.replace(/\s/g, '+');
       	 });
		
        Conference
			.Info($scope.conferenceId)
        	.then(function(data) {
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
]).controller('PeoplePageCtrl', ['$scope', '$state', 'People', 'Conference',
    function($scope, $state, People, Conference) {
        $scope.conferenceId = $state.params.id;
        $scope.peopleKey = $state.params.key;
        People.Person($scope.conferenceId, $scope.peopleKey).then(function(data) {
            $scope.peopleData = data;
            $scope.peopleData.googleScholar = "http://scholar.google.ca/scholar?q=" + data.Name.replace(/\s/g, "+") + '+' + data.Affiliation.replace(/\s/g, '+');
        });
        People.SessionsByPeopleKey($scope.conferenceId, $scope.peopleKey).then(function(data) {
            $scope.Sessions = data;
        });
        People.ItemsByPeopleKey($scope.conferenceId, $scope.peopleKey).then(function(data) {
            $scope.Items = data;
        });
        
		$scope.starred = false;
		
        Conference.Info($scope.conferenceId).then(function(data) {
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
]).controller('CustomTabCrtl', ['$scope', '$state', 'Conference',
    function($scope, $state, Conference) {
        $scope.conferenceId = $state.params.id;
        $scope.ConferenceName = "confero";
        Conference.Info($scope.conferenceId).then(function(data) {
            $scope.ConferenceInfo = data;
        });
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
    }).state('tabs.custom', {
        url: '/custom',
        views: {
            'custom-tab': {
                templateUrl: "./views/customTab.html",
                controller: "CustomTabCrtl"
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
})
.directive('onLastListItem', function($timeout) {
        return function(scope, element, attrs) {
			if (scope.$last) {
				$timeout(function(){
					scope.$emit('loadingFinished', element, attrs);
				});
			}
        };
    });