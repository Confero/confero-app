angular.module('confero.app').controller('PapersTabCrtl', ['$scope', '$state', 'Conference', '$ionicLoading', '$ionicNavBarDelegate',
    function($scope, $state, Conference, $ionicLoading, $ionicNavBarDelegate) {
        "use strict";
        $ionicLoading.show();
        $scope.conferenceId = $state.params.id;
        $scope.ConferenceName = "confero";
        $ionicNavBarDelegate.showBackButton(false);
        $scope.backToEventsList = function() {
            $state.go('eventspage');
        };
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
    }
]).controller('PaperPageCtrl', ['$scope', '$state', 'Paper', 'Conference', 'Starred', 'Navigation',
    function($scope, $state, Paper, Conference, Starred, Navigation) {
        "use strict";
        $scope.conferenceId = $state.params.id;
        $scope.paperKey = $state.params.key;
        $scope.items = {};
        $scope.starred = false;
        $scope.back = function() {
            Navigation.goBack('tabs.people', {
                id: $scope.conferenceId
            });
        };
        Paper.get($scope.conferenceId, $scope.paperKey).then(function(data) {
            $scope.paperData = data;
            $scope.paperData.urlDOI = decodeURIComponent(data.DOI);
            $scope.paperData.googleScholar = "http://scholar.google.ca/scholar?q=" + data.Title.replace(/\s/g, '+')+ '+' + data.Authors.join("+").replace("@", "").replace(/\s/g, "+");
            Starred.get($scope.conferenceId, $scope.paperKey).then(function(value) {
                $scope.starred = value;
            });
        }, function(rejection) {
            //console.log(rejection);
        });
         
        $scope.openInBrowser = function(url) {
            if(url) {
                window.open(url, '_blank', 'location=no');
            }
        };
        
        Conference.Info($scope.conferenceId).then(function(data) {
            $scope.ConferenceInfo = data;
        }, function(rejection) {
           // console.log(rejection);
        });
        $scope.$watch('starred', function(newValue, oldValue) {
            if(newValue) {
                $scope.isStarredStyle = 'ion-ios7-star colorGold';
            } else {
                $scope.isStarredStyle = 'ion-ios7-star-outline';
            }
        });
        $scope.clickStar = function() {
            Starred.toggleStar($scope.conferenceId, $scope.paperKey).then(function(value) {
                $scope.starred = value;
            });
        };
    }
]);