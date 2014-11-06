/* ConferoApp.js
 * version : 4.0.1
 * authors : Rylan Cottrell, Reid Holmes
 * license : GNU GPL
 */

angular
    .module('confero.app')
    .controller('TabsCrtl', TabsCtrl);

TabsCtrl.$inject = ['$scope', '$state', '$ionicLoading', '$rootScope'];

function TabsCtrl($scope, $state, $ionicLoading, $ionicNavBarDelegate, $rootScope) {
    $scope.conferenceId = $state.params.id;
    $scope.ConferenceName = "confero";
    $scope.$on('loadingFinished', loadingFinished);

    function loadingFinished(ngLoadEvent) {
        $ionicLoading.hide();
    }
}