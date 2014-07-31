angular.module('confero.ConferenceService', ['confero.ConferoDataService'])

.factory('Conference', ['ConferenceCache', '$q',
    function(ConferenceCache, $q) {
        var confInfoCache = {};
        return {
            People: function(confId) {
                var deferred = $q.defer();
                ConferenceCache.get(confId).then(function(conference) {
                    deferred.resolve(conference.get(confId).People);
                });
                return deferred.promise;
            },
            Sessions: function(confId) {
                var deferred = $q.defer();
                ConferenceCache.get(confId).then(function(conference) {
                    deferred.resolve(conference.get(confId).Sessions);
                });
                return deferred.promise;
            },
            Papers: function(confId) {
                var deferred = $q.defer();
                ConferenceCache.get(confId).then(function(conference) {
                    deferred.resolve(conference.get(confId).Items);
                });
                return deferred.promise;
            },
            Info: function(confId) {
                var deferred = $q.defer();
                if(confInfoCache[confId]) {
                    deferred.resolve(confInfoCache[confId]);
                } else {
                    ConferenceCache.get(confId).then(function(conference) {
                        var info = {};
                        for(var i in conference) {
                            if(conference.hasOwnProperty(i) && i !== "Sessions" && i !== "SessionsByKey" && i !== "Items" && i !== "ItemsByKey" && i !== "People" && i !== "PeopleByKey") {
                                info[i] = conference[i];
                            }
                        }
                        confInfoCache[confId] = info;
                        deferred.resolve(info);
                    });
                }
                return deferred.promise;
            }
        };
    }
]);