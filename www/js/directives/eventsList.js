angular.module('confero.eventsList', []).directive('eventsList', function() {
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: './views/EventListView.html',
    };
});