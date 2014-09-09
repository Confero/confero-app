angular.module('confero.eventsList', []).directive('eventsList', function() {
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
}).directive('errSrc', function() {
    "use strict";
	return {
        link: function(scope, element, attrs) {
            element.bind('error', function() {
                if(attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    };
});