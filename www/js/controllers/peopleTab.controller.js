/* ConferoApp.js
 * version : 4.0.1
 * authors : Rylan Cottrell, Reid Holmes
 * license : GNU GPL
 */

angular
    .module('confero.app')
    .controller('PeopleTabCrtl', PeopleTabCtrl)
    .controller('PeoplePageCtrl', PeoplePageCtrl);

PeopleTabCtrl.$inject = ['$scope', '$state', 'Conference', '$ionicLoading'];
PeoplePageCtrl.$inject = ['$scope', '$state', 'People', 'Session', 'Conference', 'Starred', 'Navigation'];

function PeopleTabCtrl($scope, $state, Conference, $ionicLoading, $ionicNavBarDelegate) {
    "use strict";
    $ionicLoading.show();
    $scope.conferenceId = $state.params.id;
    $scope.ConferenceName = "confero";
    $scope.backToEventsList = backToEventsList;
    $scope.showPeopleDivider = showPeopleDivider;
    $scope.dividerTitle = dividerTitle;

    Conference.Info($scope.conferenceId).then(function(data) {
        $scope.ConferenceInfo = data;
    }, function(rejection) {
        // console.log(rejection);
    });

    Conference.People($scope.conferenceId).then(function(data) {
        angular.forEach(data, function(value, key) {
            value.KeyEncoded = encodeURIComponent(value.Key);
            var name = value.Name.split(/\s/);
            value.firstName = name[0];
            value.lastName = name[name.length - 1];
        });
        data.sort(function(a, b) {
            var s = naturalSort(a.lastName, b.lastName);
            if(s === 0) {
                s = naturalSort(a.firstName, b.firstName);
            }
            return s;
        });
        $scope.people = data;
    }, function(rejection) {
        // console.log(rejection);
    });

    function dividerTitle($index) {
        return $scope.people[$index].lastName[0];
    }

    function showPeopleDivider($index) {
        if(!$scope.people[$index - 1]) {
            return true;
        } else {
            return $scope.people[$index - 1].lastName[0] !== $scope.people[$index].lastName[0];
        }
    }

    function backToEventsList() {
        $state.go('eventspage');
    }
}