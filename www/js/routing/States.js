angular.module('confero.app')
.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('eventspage', {
        url: "/",
        templateUrl: "events-page.html",
        controller: 'EventsListCtrl'
    }).state('tabs', {
        url: '/conference/:id',
        templateUrl: "./views/tabs.html",
		controller: "TabsCrtl",
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
    }).state('sessionPage', {
        url: "/conference/:id/session/:key",
        templateUrl: "./views/sessionPage.html",
        controller: 'SessionPageCtrl'
    }).state('paperPage', {
        url: "/conference/:id/paper/:key",
        templateUrl: "./views/paperPageView.html",
        controller: 'PaperPageCtrl',
    }).state('peoplePage', {
        url: "/conference/:id/people/:key",
        templateUrl: "./views/peoplePageView.html",
        controller: 'PeoplePageCtrl'
    });
    $urlRouterProvider.otherwise("/");
});