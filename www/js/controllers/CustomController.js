angular.module('confero.app').controller('CustomTabCrtl', ['$scope', '$state', 'Conference', '$ionicNavBarDelegate', 'Starred', 'ConferenceCache',
    function($scope, $state, Conference, $ionicNavBarDelegate, Starred, ConferenceCache) {
        $scope.conferenceId = $state.params.id;
        $scope.ConferenceName = "confero";
        
        $ionicNavBarDelegate.showBackButton(false);
        
        $scope.backToEventsList = function() {
            $state.go('eventspage');
        };
        
        Conference.Info($scope.conferenceId).then(function(data) {
            $scope.ConferenceInfo = data;
        }, function(rejection) {
            console.log(rejection);
        });
        
        $scope.hasStarred = function() {
            return $scope.Sessions || $scope.Items || $scope.People;
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
        
        Starred.get($scope.conferenceId).then(function(keys) {
            $scope.Sessions = [];
            $scope.Items = [];
            $scope.People = [];
            var resolveKeys = function(key) {
                ConferenceCache.get($scope.conferenceId).then(function(conf) {
                    var result = conf.resolveKey($scope.conferenceId, key);
                    if(result.session) {
                        $scope.Sessions.push(result.session);
                    } else if(result.item) {
                        $scope.Items.push(result.item);
                    } else if(result.person) {
                        $scope.People.push(result.person);
                    }
                });
            };
            
            for(var k in keys) {
                if(keys.hasOwnProperty(k)) {
                    resolveKeys(k);
                }
            }
            
            
            
        }, function(rejection) {
            console.log(rejection);
        });
    }
]);