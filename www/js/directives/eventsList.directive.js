/* ConferoApp.js
 * version : 4.0.1
 * authors : Rylan Cottrell, Reid Holmes
 * license : GNU GPL
 */

angular
    .module('confero.app')
    .directive('eventsList', eventsList);

function eventsList() {
    "use strict";
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: 'EventListView.html',
        scope: {
            events: "=events",
            locationWWW: "=location",
            index: "=index"
        }
    };
}