angular.module('confero.peopleItem', ['confero.PeopleService']).directive('peopleItem', function(People) {
    "use strict";
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: 'peopleItemView.html',
        scope: {
            person: "=",
            conferenceId: "=conference",
            key: "=key"
        },
        controller: function($scope) {
            $scope.$watch('personData', function(newValue, oldValue) {
                if(newValue) {
                    $scope.personData.KeyEncoded = encodeURIComponent($scope.personData.Key);
                }
            });
            if(!$scope.person && $scope.key) {
                var k = encodeURIComponent($scope.key);
                var personPromise = People.Person($scope.conferenceId, $scope.key);
                personPromise.then(function(data) {
                    $scope.personData = data;
                });
            } else {
                $scope.personData = $scope.person;
            }
        }
    };
});