angular
    .module('confero.app')
    .controller('SessionPageCtrl', SessionPageCtrl);

SessionPageCtrl.$inject = ['$scope', '$state', 'Session', 'Conference', 'Starred', 'Navigation'];

function SessionPageCtrl($scope, $state, Session, Conference, Starred, Navigation) {
    "use strict";
    $scope.conferenceId = $state.params.id;
    $scope.sessionKey = $state.params.key;
    $scope.items = {};
    $scope.starred = false;
    $scope.back = back;
    $scope.clickStar = clickStar;
    $scope.$watch('starred', starred);

    Session.get($scope.conferenceId, $scope.sessionKey).then(function(data) {
        var t = data.Time.split('-');
        if(t[0].indexOf('m') > -1) { //old standard
            data.StartTime = moment(data.Day + ' ' + t[0].trim(), 'MM-DD-YYYY HH:mm a');
            if(!t[1]) {
                t[1] = "11:59 pm";
            }
            data.EndTime = moment(data.Day + ' ' + t[1].trim(), 'MM-DD-YYYY HH:mm a');
        } else { //new standard
            data.StartTime = moment(data.Day + ' ' + t[0].trim(), "YYYY-MM-DD HH:mm");
            data.EndTime = moment(data.Day + ' ' + t[1].trim(), "YYYY-MM-DD HH:mm");
        }
        data.PrettyDateTime = data.StartTime.format("ddd MMMM D[th] HH:mm") + ' - ' + data.EndTime.format("HH:mm");
        data.Colour = 'colour' + (simpleHash(data.Location) % 15);
        $scope.session = data;
        Starred.get($scope.conferenceId, $scope.sessionKey).then(function(value) {
            $scope.starred = value;
        });
    }, function(rejection) {
        console.log(rejection);
    });

    Conference.Info($scope.conferenceId).then(function(data) {
        $scope.ConferenceInfo = data;
    }, function(rejection) {
        console.log(rejection);
    });

    function starred(newValue, oldValue) {
        if(newValue) {
            $scope.isStarredStyle = 'ion-ios7-star colorGold';
        } else {
            $scope.isStarredStyle = 'ion-ios7-star-outline';
        }
    }

    function back() {
        Navigation.goBack('tabs.people', {
            id: $scope.conferenceId
        });
    }

    function clickStar() {
        Starred.toggleStar($scope.conferenceId, $scope.sessionKey).then(function(value) {
            $scope.starred = value;
        });
    }
}