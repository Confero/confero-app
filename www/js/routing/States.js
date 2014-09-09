angular.module('confero.app').config(function($stateProvider, $urlRouterProvider) {
    "use strict";
    $stateProvider.state('eventspage', {
        url: "/",
        templateUrl: "events-page.html",
        controller: 'EventsListCtrl'
    }).state('tabs', {
        url: '/conference/:id',
        templateUrl: "tabs.html",
        controller: "TabsCrtl",
    }).state('tabs.sessions', {
        url: '/sessions',
        views: {
            'sessions-tab': {
                templateUrl: "sessionsTab.html",
                controller: "SessionsTabCrtl"
            }
        }
    }).state('tabs.custom', {
        url: '/custom',
        views: {
            'custom-tab': {
                templateUrl: "customTab.html",
                controller: "CustomTabCrtl"
            }
        }
    }).state('tabs.people', {
        url: '/people',
        views: {
            'people-tab': {
                templateUrl: "peopleTab.html",
                controller: "PeopleTabCrtl"
            }
        }
    }).state('tabs.papers', {
        url: '/papers',
        views: {
            'papers-tab': {
                templateUrl: "papersTab.html",
                controller: "PapersTabCrtl"
            }
        }
    }).state('sessionPage', {
        url: "/conference/:id/session/:key",
        templateUrl: "sessionPage.html",
        controller: 'SessionPageCtrl'
    }).state('paperPage', {
        url: "/conference/:id/paper/:key",
        templateUrl: "paperPageView.html",
        controller: 'PaperPageCtrl',
    }).state('peoplePage', {
        url: "/conference/:id/people/:key",
        templateUrl: "peoplePageView.html",
        controller: 'PeoplePageCtrl'
    }).state('aboutPage', {
        url: "/about",
        templateUrl: "aboutPageView.html",
        controller: 'AboutCtrl'
    });
    $urlRouterProvider.otherwise("/");
});