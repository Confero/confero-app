angular.module('confero.paperItem', ['confero.PaperService'])

.directive('paperItem', ['Paper', function(Paper) {
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
                var paperPromise = Paper.get($scope.conferenceId, $scope.key);
                paperPromise.then(function(data) {
                    $scope.paperData = data;
                    setupData();
                });
            } else {
                $scope.paperData = $scope.paper;
                setupData();
            }
        }
    };
}]);