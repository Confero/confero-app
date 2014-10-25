angular
    .module('confero.app')
    .directive('conferoTabs', conferoTabs);

function conferoTabs() {
    "use strict";
    return {
        restrict: 'E',
        templateUrl: 'tabs.html'
    };
}