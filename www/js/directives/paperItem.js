angular.module('confero.paperItem', ['confero.paperService']).directive('paperItem', function(Paper) {
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: './views/paperItemView.html',
        scope: {
            paper: "=",
            conferenceId: "=conference",
            key: "=key"
        },
        controller: function($scope) {
            var setupData = function() {
				$scope.paperData.KeyEncoded = encodeURIComponent($scope.paperData.Key);
			};
            if(!$scope.paper && $scope.key) {
                var item = Paper.get({
                    id: $scope.conferenceId,
                    key: $scope.key
                });
                item.$promise.then(function(data) {
                    $scope.paperData = data;
					setupData();
                });
            } else {
                $scope.paperData = $scope.paper;
				setupData();
            }
        }
    };
});