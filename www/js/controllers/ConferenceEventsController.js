angular.module('confero.app')

.controller('EventsListCtrl', ['$scope', 'EventsIndex', '$state',
    function($scope, EventsIndex, $state) {
        $scope.locationWWW = 'http://ranche-exogen.codio.io:3000';
        $scope.pastEvents = [];
        $scope.upcomingEvents = [];
        $scope.inProgressEvents = [];
        
        $scope.openAbout = function(){
            $state.go('aboutPage');
        };
        
        EventsIndex.Past().then(function(data) {
            $scope.pastEvents = data;
        }, function(rejection){
            console.log(rejection);
        });
        EventsIndex.UpComing().then(function(data) {
            $scope.upcomingEvents = data;
        }, function(rejection){
            console.log(rejection);
        });
        EventsIndex.InProgress().then(function(data) {
            $scope.inProgressEvents = data;
        }, function(rejection){
            console.log(rejection);
        });
    }
]);