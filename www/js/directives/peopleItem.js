angular.module('confero.peopleItem', ['confero.PeopleService']).directive('peopleItem', function(People) {
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: './views/peopleItemView.html',
        scope: {
            person: "=",
            conferenceId: "=conference",
            key: "=key"
        },
        controller: function($scope) {
			var setupData = function() {
				$scope.personData.KeyEncoded = encodeURIComponent($scope.personData.Key);
			};
            if(!$scope.person && $scope.key) {
                var k = encodeURIComponent($scope.key);
                var personPromise = People.Person($scope.conferenceId, $scope.key);
                personPromise.then(function(data) {
                    $scope.personData = data;
					setupData();
                });
            } else {
                $scope.personData = $scope.person;
				setupData();
            }
        }
    };
});