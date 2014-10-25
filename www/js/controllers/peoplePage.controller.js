angular
    .module('confero.app')
    .controller('PeoplePageCtrl', PeoplePageCtrl);

PeoplePageCtrl.$inject = ['$scope', '$state', 'People', 'Session', 'Conference', 'Starred', 'Navigation'];

function PeoplePageCtrl($scope, $state, People, Session, Conference, Starred, Navigation) {
    "use strict";
    $scope.conferenceId = $state.params.id;
    $scope.peopleKey = $state.params.key;
    $scope.back = back;
    $scope.clickStar = clickStar;
    $scope.starred = false;
    $scope.openInGoogleScholar = openInGoogleScholar;
    $scope.$watch('starred', starred);

    People.Person($scope.conferenceId, $scope.peopleKey).then(function(data) {
        $scope.peopleData = data;
        $scope.peopleData.googleScholar = "http://scholar.google.ca/scholar?q=" + data.Name.replace(/\s/g, "+") + '+' + data.Affiliation.replace(/\s/g, '+');
        Starred
            .get($scope.conferenceId, $scope.peopleKey)
            .then(function(value) {
                $scope.starred = value;
            });
    }, function(rejection) {
        //  console.log(rejection);
    });

    People.ItemsByPeopleKey($scope.conferenceId, $scope.peopleKey).then(function(data) {
        $scope.Items = data;
        $scope.Sessions = {};

        angular.forEach($scope.Items, function(value, index) {
            Session.SessionByPaperKey($scope.conferenceId, value.Key).then(function(sdata) {
                if(!$scope.Sessions[sdata.Key]) {
                    $scope.Sessions[sdata.Key] = sdata;
                    $scope.Sessions[sdata.Key].StartDate = new Date($scope.Sessions[sdata.Key].StartTime.format());
                    $scope.Sessions[sdata.Key].EndDate = new Date($scope.Sessions[sdata.Key].EndTime.format());
                    $scope.Sessions[sdata.Key].ItemsFull = [];

                }
                $scope.Sessions[sdata.Key].ItemsFull.push(value);
            });
        });
    }, function(rejection) {
        //  console.log(rejection);
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

    function openInGoogleScholar(url) {
        if(url) {
            window.open(url, '_blank', 'location=no');
        }
    }

    function clickStar() {
        Starred
            .toggleStar($scope.conferenceId, $scope.peopleKey)
            .then(function(value) {
                $scope.starred = value;
            });
    }

    function back() {
        Navigation.goBack('tabs.people', {
            id: $scope.conferenceId
        });
    }
}