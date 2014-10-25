angular
    .module('confero.app')
    .directive('errSrc', errSrc);

function errSrc() {
    "use strict";
    return {
        link: function(scope, element, attrs) {
            element.bind('error', error);

            function error() {
                if(attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            }
        }
    };
}