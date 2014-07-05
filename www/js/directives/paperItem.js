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
            if(!$scope.paper && $scope.key) {
                var item = Paper.get({
                    id: $scope.conferenceId,
                    key: $scope.key
                });
                item.$promise.then(function(data) {
                    $scope.paperData = data;
                });
            } else {
                $scope.paperData = $scope.paper;
            }
        }
    };
});