/* ConferoApp.js
 * version : 4.0.1
 * authors : Rylan Cottrell, Reid Holmes
 * license : GNU GPL
 */

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