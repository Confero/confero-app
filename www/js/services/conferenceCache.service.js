angular
    .module('confero.app')
    .factory('ConferenceCache', ConferenceCache);

ConferenceCache.$inject = ['$resource', '$cacheFactory', '$localForage', 'ConferenceData', 'EventsData', '$q'];

function ConferenceCache($resource, $cacheFactory, $localForage, ConferenceData, EventsData, $q) {
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

                    var version = EventsData.getEventById(confId) ? EventsData.getEventById(confId).Version : 0;
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
    var service = {
        get: get
    };
    return service;

    ///////

    function get(confId) {
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
                    if(eventData) {
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
}