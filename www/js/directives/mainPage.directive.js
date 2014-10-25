angular
    .module('confero.app')
    .directive('mainPage', mainPage);

function mainPage() {
    "use strict";
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: 'mainPageView.html',
    };
}