angular.module('confero.EventsService', ['confero.ConferoDataService']).factory('EventsIndex', ['EventsCache', '$q',
    function(EventsCache, $q) {
        return {
            Past: function() {
                var deferred = $q.defer();
                EventsCache.get().then(function(eventsIndex) {
                    var now = moment();
                    deferred.resolve(eventsIndex.getEventsByTemporal('past', now));
                }, function(rejection) {
                    console.log(rejection);
                });
                return deferred.promise;
            },
            UpComing: function() {
                var deferred = $q.defer();
                EventsCache.get().then(function(eventsIndex) {
                    var now = moment();
                    deferred.resolve(eventsIndex.getEventsByTemporal('upcoming', now));
                }, function(rejection) {
                    console.log(rejection);
                });
                return deferred.promise;
            },
            InProgress: function() {
                var deferred = $q.defer();
                EventsCache.get().then(function(eventsIndex) {
                    var now = moment();
                    deferred.resolve(eventsIndex.getEventsByTemporal('inprogress', now));
                }, function(rejection) {
                    console.log(rejection);
                });
                return deferred.promise;
            }
        };
    }
]);