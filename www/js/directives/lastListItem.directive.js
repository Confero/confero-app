/* ConferoApp.js
 * version : 4.0.1
 * authors : Rylan Cottrell, Reid Holmes
 * license : GNU GPL
 */

angular
    .module('confero.app')
    .directive('onLastListItem', onLastListItem);

onLastListItem.$inject = ['$timeout'];

function onLastListItem($timeout) {
    "use strict";
    return function(scope, element, attrs) {
        if(scope.$last) {
            $timeout(loadingFinished, 10);
        }

        function loadingFinished() {
            scope.$emit('loadingFinished', element);
        }
    };
}