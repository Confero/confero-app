angular.module('confero.eventsList', []).directive('eventsList', function() {
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: './views/EventListView.html',
        scope: {
            events: "=events",
            locationWWW: "=location",
            index: "=index"
        }
    };
}).directive('errSrc', function() {
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