angular.module('confero.mainPage', []).directive('mainPage', function() {
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: './views/mainPageView.html',
    };
});