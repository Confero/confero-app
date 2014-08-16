angular.module('confero.app')
.controller('CustomTabCrtl', ['$scope', '$state', 'Conference', '$ionicNavBarDelegate',
    function($scope, $state, Conference, $ionicNavBarDelegate) {
        $scope.conferenceId = $state.params.id;
        $scope.ConferenceName = "confero";
        $ionicNavBarDelegate.showBackButton(false);
        $scope.backToEventsList = function(){
           $state.go('eventspage');
        };
        Conference.Info($scope.conferenceId).then(function(data) {
            $scope.ConferenceInfo = data;
        }, function(rejection){
            console.log(rejection);
        });
    }
]);