angular.module('confero.app')

.controller('EventsListCtrl', ['$scope', 'EventsIndex',
    function($scope, EventsIndex) {
        $scope.locationWWW = 'http://ranche-exogen.codio.io:3000';
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
]);