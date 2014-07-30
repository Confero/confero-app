angular.module('confero.peopleItem', ['confero.peopleService']).directive('peopleItem', function(Person) {
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
                var item = Person.get({
                    id: $scope.conferenceId,
                    key: k
                });
                item.$promise.then(function(data) {
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