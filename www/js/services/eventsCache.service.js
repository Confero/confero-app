/* ConferoApp.js
 * version : 4.0.1
 * authors : Rylan Cottrell, Reid Holmes
 * license : GNU GPL
 */

angular
    .module('confero.app')
    .factory('EventsCache', EventsCache);

EventsCache.$inject = ['$resource', '$cacheFactory', '$localForage', 'EventsData', '$q'];

function EventsCache($resource, $cacheFactory, $localForage, EventsData, $q) {
    "use strict";
    var deferred = $q.defer();
    if(!EventsData.getEventIndex()) {
        var fetchFromServer = function() {
            var www = 'http://ec2-54-164-164-122.compute-1.amazonaws.com:3000';
            var res = www + '/conferences/events';
            var call = $resource(res, {}, {
                'get': {
                    method: 'GET',
                    cache: $cacheFactory
                }
            }).get();
            call.$promise.then(function(data) {
                EventsData.setEventsIndex(data);
                deferred.resolve(EventsData);
                deferred.notify('server');
                $localForage.setItem('ConferoEventIndex', data);
            }, function(rejection) {
                console.log(rejection);
            });
        };
        $localForage.getItem('ConferoEventIndex').then(function(value) {
            if(value) {
                EventsData.setEventsIndex(value);
                deferred.resolve(EventsData);
                deferred.notify('storage');
            } else {
                var res = 'assets/conf-data/EventIndex.json';
                var call = $resource(res, {}, {
                    'get': {
                        method: 'GET',
                        cache: $cacheFactory
                    }
                }).get();
                call.$promise.then(function(data) {
                    EventsData.setEventsIndex(data);
                    deferred.resolve(EventsData);
                    deferred.notify('local');
                    $localForage.setItem('ConferoEventIndex', data).then(function() {
                        fetchFromServer();
                    });
                }, function(reason) {
                    fetchFromServer();
                });
            }
        }, function(rejection) {
            deferred.reject(rejection);
        });
    } else {
        deferred.resolve(EventsData);
        deferred.notify('cache');
    }

    var service = {
        get: get
    };

    return service;

    function get() {
        return deferred.promise;
    }

}