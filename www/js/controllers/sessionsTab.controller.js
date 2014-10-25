angular
    .module('confero.app')
    .controller('SessionsTabCrtl', SessionTabCtrl);

SessionTabCtrl.$inject = ['$scope', '$state', 'Conference', '$ionicLoading'];

function SessionTabCtrl($scope, $state, Conference, $ionicLoading, $timeout) {
    "use strict";
    $ionicLoading.show();
    $scope.conferenceId = $state.params.id;
    $scope.ConferenceName = "confero";
    $scope.backToEventsList = backToEventsList;
    $scope.showSessionDivider = showSessionDivider;

    Conference.Sessions($scope.conferenceId).then(function(data) {
        $scope.sessions = data;
    }, function(rejection) {
        console.log(rejection);
    });
    Conference.Info($scope.conferenceId).then(function(data) {
        $scope.ConferenceInfo = data;
    }, function(rejection) {
        console.log(rejection);
    });

    function backToEventsList() {
        $state.go('eventspage');
    }

    function showSessionDivider(index) {
        if($scope.sessions) {
            if(index === 0) {
                return true;
            } else {
                if($scope.sessions[index] && $scope.sessions[index - 1]) {
                    return $scope.sessions[index].PrettyDateTime !== $scope.sessions[index - 1].PrettyDateTime;
                }
            }
        }
    }
}