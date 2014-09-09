angular.module('confero.ConferoDataService', ['ngResource', 'LocalForageModule', 'confero.ConferoDataObjects'])
	.factory('EventsCache', ['$resource', '$cacheFactory', '$localForage', 'EventsData', '$q',
    function($resource, $cacheFactory, $localForage, EventsData, $q) {
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
        return {
            get: function() {
                return deferred.promise;
            }
        };
    }
]).factory('ConferenceCache', ['$resource', '$cacheFactory', '$localForage', 'ConferenceData', 'EventsData', '$q',
    function($resource, $cacheFactory, $localForage, ConferenceData, EventsData, $q) {
        var fetchFromServer = function(confId, deferred, currentVersion) {
            var www = 'http://ec2-54-164-164-122.compute-1.amazonaws.com:3000';
            var confLoc = '/conference/:id';
            var verLoc = '/conferences/event/:id/version';
            var call = $resource(www + verLoc, {}, {
                'get': {
                    method: 'GET',
                    params: {
                        id: '',
                    },
                    cache: $cacheFactory
                }
            }).get({
                id: confId
            });
            call.$promise.then(function(data) {
                if(!currentVersion || data.version > currentVersion) {
                    var call = $resource(www + confLoc, {}, {
                        'get': {
                            method: 'GET',
                            params: {
                                id: '',
                            },
                            cache: $cacheFactory
                        }
                    }).get({
                        id: confId
                    });
                    call.$promise.then(function(data) {
                        
                        var version = EventsData.getEventById(confId)? EventsData.getEventById(confId).Version: 0;
                        ConferenceData.addConference(confId, data, version);
                        deferred.resolve(ConferenceData);
                        deferred.notify('server');
                        data.Version = version;
                        $localForage.setItem(confId, data);
                    });
                }
            }, function(rejection) {
                deferred.reject(rejection);
            });
        };
        return {
            get: function(confId) {
                var deferred = $q.defer();
                if(ConferenceData.get(confId)) {
                    deferred.resolve(ConferenceData);
                    deferred.notify('cache');
                } else {
                    $localForage.getItem(confId).then(function(value) {
                        if(value) {
                            ConferenceData.addConference(confId, value, value.Version);
                            deferred.resolve(ConferenceData);
                            deferred.notify('storage');
                            fetchFromServer(confId, deferred, value.Version);
                        } else {
                            var eventData = EventsData.getEventById(confId);
                            if( eventData ) {
                                var res = 'assets/conf-data/data/' + eventData.File;
                                var call = $resource(res, {}, {
                                    'get': {
                                        method: 'GET',
                                        cache: $cacheFactory
                                    }
                                }).get();
                                call.$promise.then(function(data) {
                                    var version = EventsData.getEventById(confId).Version;
                                    ConferenceData.addConference(confId, data, version);
                                    deferred.resolve(ConferenceData);
                                    deferred.notify('local');
                                    data.Version = version;
                                    $localForage.setItem(confId, data).then(function() {
                                        fetchFromServer(confId, deferred, version);
                                    });
                                }, function(reason) {
                                    fetchFromServer(confId, deferred);
                                });
                            } else {
                                fetchFromServer(confId, deferred);
                            }
                        }
                    }, function(rejection) {
                        deferred.reject(rejection);
                    });
                }
                return deferred.promise;
            }
        };
    }
]);