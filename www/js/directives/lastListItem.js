angular.module('confero.lastListItem', []).directive('onLastListItem', function($timeout) {
    "use strict";
    return function(scope, element, attrs) {
        if(scope.$last) {
            $timeout(function() {
                scope.$emit('loadingFinished', element);
            }, 10);
        }
    };
});