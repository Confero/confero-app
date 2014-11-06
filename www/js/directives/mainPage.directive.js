/* ConferoApp.js
 * version : 4.0.1
 * authors : Rylan Cottrell, Reid Holmes
 * license : GNU GPL
 */

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