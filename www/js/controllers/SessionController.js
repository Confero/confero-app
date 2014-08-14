angular.module('confero.app')
.controller('SessionsTabCrtl', ['$scope', '$state', 'Conference', '$ionicLoading', '$ionicNavBarDelegate', 
    function($scope, $state, Conference, $ionicLoading, $ionicNavBarDelegate) {
        $ionicLoading.show();
        $scope.conferenceId = $state.params.id;
        $scope.ConferenceName = "confero";
        $ionicNavBarDelegate.showBackButton(false);
        $scope.backToEventsList = function(){
           $state.go('eventspage');
        };
        $scope.showSessionDivider = function(index) {
            if($scope.sessions) {
                if(index === 0) {
                    return true;
                } else {
                    if($scope.sessions[index] && $scope.sessions[index - 1]) {
                        return $scope.sessions[index].PrettyDateTime !== $scope.sessions[index - 1].PrettyDateTime;
                    }
                }
            }
        };

        Conference
            .Sessions($scope.conferenceId)
            .then(function(data) {
                $scope.sessions = data;
            });
         
        Conference
            .Info($scope.conferenceId)
            .then(function(data) {
               $scope.ConferenceInfo = data;
        });
    }
]).controller('SessionPageCtrl', ['$scope', '$state', 'Session', 'Conference', 'Starred', 'Navigation',
    function($scope, $state, Session, Conference, Starred, Navigation) {
        $scope.conferenceId = $state.params.id;
        $scope.sessionKey = $state.params.key;
        $scope.items = {};
        $scope.starred = false;

        $scope.back = function() {
            Navigation.goBack('tabs.people', {id: $scope.conferenceId});
        };

        Session
            .get($scope.conferenceId, $scope.sessionKey)
            .then(function(data) {
                var t = data.Time.split('-');
                data.StartTime = moment(data.Day + ' ' + t[0].trim(), "YYYY-MM-DD HH:mm");
                data.EndTime = moment(data.Day + ' ' + t[1].trim(), "YYYY-MM-DD HH:mm");
                data.PrettyDateTime = data.StartTime.format("ddd MMMM D[th] HH:mm") + ' - ' + data.EndTime.format("HH:mm");
                data.Colour = 'colour' + (simpleHash(data.Location) % 15);
                $scope.session = data;
                Starred
                   .get($scope.conferenceId, $scope.sessionKey)
                   .then(function(value){
                      $scope.starred = value;
                   });
        });
        
        Conference
            .Info($scope.conferenceId)
            .then(function(data) {
                $scope.ConferenceInfo = data;
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
                .toggleStar($scope.conferenceId, $scope.sessionKey)
                .then(function(value){
                    $scope.starred = value;
                });
        };
    }
]);