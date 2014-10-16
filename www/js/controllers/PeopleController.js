angular.module('confero.app')
    .controller('PeopleTabCrtl', ['$scope', '$state', 'Conference', '$ionicLoading',
        function($scope, $state, Conference, $ionicLoading, $ionicNavBarDelegate) {
            "use strict";
            $ionicLoading.show();

            $scope.conferenceId = $state.params.id;
            $scope.ConferenceName = "confero";

            $scope.backToEventsList = function() {
                $state.go('eventspage');
            };

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

            $scope.dividerTitle = function($index) {
                return $scope.people[$index].lastName[0];
            };
            $scope.showPeopleDivider = function($index) {
                if(!$scope.people[$index - 1]) {
                    return true;
                } else {
                    return $scope.people[$index - 1].lastName[0] !== $scope.people[$index].lastName[0];
                }
            };
        }
    ])
    .controller('PeoplePageCtrl', ['$scope', '$state', 'People', 'Session', 'Conference', 'Starred', 'Navigation',
        function($scope, $state, People, Session, Conference, Starred, Navigation) {
            "use strict";
            $scope.conferenceId = $state.params.id;
            $scope.peopleKey = $state.params.key;

            $scope.back = function() {
                Navigation.goBack('tabs.people', {
                    id: $scope.conferenceId
                });
            };

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

            $scope.openInGoogleScholar = function(url) {
                if(url) {
                    window.open(url, '_blank', 'location=no');
                }
            };

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

            $scope.starred = false;

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
                Starred
                    .toggleStar($scope.conferenceId, $scope.peopleKey)
                    .then(function(value) {
                        $scope.starred = value;
                    });
            };
        }
    ]);