angular
    .module('confero.app')
    .factory('EventsIndex', EventsIndex);

EventsIndex.$inject = ['EventsCache', '$q'];

function EventsIndex(EventsCache, $q) {
    "use strict";
    var service = {
        Past: Past,
        UpComing: UpComing,
        InProgress: InProgress
    };

    return service;

    //////

    function Past() {
        var deferred = $q.defer();
        EventsCache.get().then(function(eventsIndex) {
            var now = moment();
            deferred.resolve(eventsIndex.getEventsByTemporal('past', now));
        }, function(rejection) {
            console.log(rejection);
        });
        return deferred.promise;
    }

    function UpComing() {
        var deferred = $q.defer();
        EventsCache.get().then(function(eventsIndex) {
            var now = moment();
            deferred.resolve(eventsIndex.getEventsByTemporal('upcoming', now));
        }, function(rejection) {
            console.log(rejection);
        });
        return deferred.promise;
    }

    function InProgress() {
        var deferred = $q.defer();
        EventsCache.get().then(function(eventsIndex) {
            var now = moment();
            deferred.resolve(eventsIndex.getEventsByTemporal('inprogress', now));
        }, function(rejection) {
            console.log(rejection);
        });
        return deferred.promise;
    }

}