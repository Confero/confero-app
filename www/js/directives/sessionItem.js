angular.module('confero.sessionItem', ['confero.SessionService']).directive('sessionItem', function(Session) {
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: './views/sessionItemView.html',
        scope: {
            session: "=",
            conferenceId: "=conference",
            key: "=key",
            paperkey: "=paperkey"
        },
        controller: function($scope) {
            var sessionPromise;
            var setupData = function() {
                $scope.sessionData.KeyEncoded = encodeURIComponent($scope.sessionData.Key);
                var time = $scope.sessionData.Time.split('-');
                $scope.sessionData.StartTime = moment($scope.sessionData.Day + ' ' + time[0].trim(), 'YYYY-MM-DD HH:mm');
                $scope.sessionData.EndTime = moment($scope.sessionData.Day + ' ' + time[1].trim(), 'YYYY-MM-DD HH:mm');
                $scope.sessionData.PrettyDate = $scope.sessionData.StartTime.format("dddd MMMM D[th]");
                $scope.sessionData.PrettyDateTime = $scope.sessionData.StartTime.format("ddd MMMM D[th] HH:mm") + ' - ' + $scope.sessionData.EndTime.format("HH:mm");
                $scope.sessionData.PrettyDateTimeFull = $scope.sessionData.StartTime.format("dddd MMMM D[th] HH:mm") + ' - ' + $scope.sessionData.EndTime.format("HH:mm");
                $scope.sessionData.Colour = 'colour' + (simpleHash($scope.sessionData.Location) % 15);
            };
            if($scope.session) {
                $scope.sessionData = $scope.session;
                setupData();
            }
            $scope.$watch('key', function(newValue) {
				if($scope.key) {
                sessionPromise = Session.get($scope.conferenceId, $scope.key);
                sessionPromise.then(function(data) {
                    $scope.sessionData = data;
                    setupData();
                });
				}
            });
            $scope.$watch('paperkey', function(newValue) {
                if($scope.paperkey) {
                    sessionPromise = Session.SessionByPaperKey($scope.conferenceId, $scope.paperkey);
                    sessionPromise.then(function(data) {
                        $scope.sessionData = data;
                        setupData();
                    });
                }
            });
        }
    };
});