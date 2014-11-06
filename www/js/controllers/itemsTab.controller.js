/* ConferoApp.js
 * version : 4.0.1
 * authors : Rylan Cottrell, Reid Holmes
 * license : GNU GPL
 */

angular
    .module('confero.app')
    .controller('PapersTabCrtl', PapersTabCtrl);

PapersTabCtrl.$inject = ['$scope', '$state', 'Conference', '$ionicLoading', '$ionicNavBarDelegate'];

function PapersTabCtrl($scope, $state, Conference, $ionicLoading, $ionicNavBarDelegate) {
    "use strict";
    $ionicLoading.show();
    $scope.conferenceId = $state.params.id;
    $scope.ConferenceName = "confero";
    $ionicNavBarDelegate.showBackButton(false);
    $scope.backToEventsList = backToEventsList;

    Conference.Info($scope.conferenceId).then(function(data) {
        $scope.ConferenceInfo = data;
    }, function(rejection) {
        // console.log(rejection);
    });
    Conference.Papers($scope.conferenceId).then(function(data) {
        angular.forEach(data, function(value, key) {
            value.KeyEncoded = encodeURIComponent(value.Key);
        });
        data.sort(function(a, b) {
            return naturalSort(a.Title, b.Title);
        });
        $scope.papers = data;
    }, function(rejection) {
        //console.log(rejection);
    });

    function backToEventsList() {
        $state.go('eventspage');
    }
}