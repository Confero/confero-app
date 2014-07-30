angular.module('confero.ConferoDataService', ['ngResource', 'LocalForageModule', 'confero.ConferoDataObjects']).factory('EventsCache', ['$resource', '$cacheFactory', '$localForage', 'EventsData', '$q',
    function($resource, $cacheFactory, $localForage, EventsData, $q) {
        return {
            get: function() {
                var deferred = $q.defer();
                if(!EventsData.getEventIndex()) {
                    var fetchFromServer = function() {
                        var www = 'http://' + location.hostname + ':3000';
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
                        });
                    };
                    $localForage.getItem('ConferoEventIndex').then(function(value) {
                        if(value) {
                            EventsData.setEventsIndex(value);
                            deferred.resolve(EventsData);
                            deferred.notify('storage');
                        } else {
                            var res = 'assets/EventIndex.json';
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
                                $localForage.setItem('ConferoEventIndex', eventsData).then(function() {
                                    fetchFromServer();
                                });
                            }, function(reason) {
                                fetchFromServer();
                            });
                        }
                    });
                } else {
                    deferred.resolve(EventsData);
                    deferred.notify('memory');
                }
                return deferred.promise;
            }
        };
    }
]);