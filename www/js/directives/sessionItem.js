angular.module('confero.sessionItem', ['confero.sessionService']).directive('sessionItem', function(Paper, Session, SessionByPaperKey) {
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
            var item;
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
                item = Session.get({
                    id: $scope.conferenceId,
                    key: $scope.key
                });
                item.$promise.then(function(data) {
                    $scope.sessionData = data;
                    setupData();
                });
            });
            $scope.$watch('paperkey', function(newValue) {
                item = SessionByPaperKey.get({
                    id: $scope.conferenceId,
                    paperkey: $scope.paperkey
                });
                item.$promise.then(function(data) {
                    $scope.sessionData = data;
                    setupData();
                });
            });
        }
    };
});