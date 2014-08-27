angular.module('confero.mainPage', []).directive('mainPage', function() {
    "use strict";
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: 'views/mainPageView.html',
    };
});