angular
    .module('confero.app')
    .controller('EventsListCtrl', EventsListCtrl);

EventsListCtrl.$inject = ['$scope', 'EventsIndex', '$state'];

function EventsListCtrl($scope, EventsIndex, $state) {
    "use strict";
    $scope.locationWWW = 'http://ranche-exogen.codio.io:3000';
    $scope.pastEvents = [];
    $scope.upcomingEvents = [];
    $scope.inProgressEvents = [];

    $scope.openAbout = openAbout;

    EventsIndex.Past().then(function(data) {
        $scope.pastEvents = data;
    }, function(rejection) {
        //console.log(rejection);
    });

    EventsIndex.UpComing().then(function(data) {
        $scope.upcomingEvents = data;
    }, function(rejection) {
        //console.log(rejection);
    });

    EventsIndex.InProgress().then(function(data) {
        $scope.inProgressEvents = data;
    }, function(rejection) {
        //console.log(rejection);
    });

    function openAbout() {
        $state.go('aboutPage');
    }
}