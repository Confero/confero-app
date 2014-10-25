angular
    .module('confero.app')
    .controller('PapersPageCtrl', PapersPageCtrl);

PapersPageCtrl.$inject = ['$scope', '$state', 'Paper', 'Conference', 'Starred', 'Navigation'];

function PapersPageCtrl($scope, $state, Paper, Conference, Starred, Navigation) {
    "use strict";
    $scope.conferenceId = $state.params.id;
    $scope.paperKey = $state.params.key;
    $scope.items = {};
    $scope.starred = false;
    $scope.back = back;
    $scope.clickStar = clickStar;
    $scope.openInBrowser = openInBrowser;
    $scope.$watch('starred', starred);

    Paper.get($scope.conferenceId, $scope.paperKey).then(function(data) {
        $scope.paperData = data;
        $scope.paperData.urlDOI = decodeURIComponent(data.DOI);
        $scope.paperData.googleScholar = "http://scholar.google.ca/scholar?q=" + data.Title.replace(/\s/g, '+') + '+' + data.Authors.join("+").replace("@", "").replace(/\s/g, "+");
        Starred.get($scope.conferenceId, $scope.paperKey).then(function(value) {
            $scope.starred = value;
        });
    }, function(rejection) {
        //console.log(rejection);
    });

    Conference.Info($scope.conferenceId).then(function(data) {
        $scope.ConferenceInfo = data;
    }, function(rejection) {
        // console.log(rejection);
    });

    function starred(newValue, oldValue) {
        if(newValue) {
            $scope.isStarredStyle = 'ion-ios7-star colorGold';
        } else {
            $scope.isStarredStyle = 'ion-ios7-star-outline';
        }
    }

    function openInBrowser(url) {
        if(url) {
            window.open(url, '_blank', 'location=no');
        }
    }

    function clickStar() {
        Starred.toggleStar($scope.conferenceId, $scope.paperKey).then(function(value) {
            $scope.starred = value;
        });
    }

    function back() {
        Navigation.goBack('tabs.people', {
            id: $scope.conferenceId
        });
    }
}