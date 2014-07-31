angular.module('confero.PeopleService', ['confero.ConferoDataService'])

.factory('People', ['ConferenceCache', '$q',
    function(ConferenceCache, $q) {
        return {
            Person: function(confId, personKey) {
                var deferred = $q.defer();
                ConferenceCache.get(confId).then(function(conf) {
                    deferred.resolve(conf.getPersonByKey(confId,personKey));
                });
                return deferred.promise;
            },
            SessionsByPeopleKey: function(confId, personKey) {
                var deferred = $q.defer();
                ConferenceCache.get(confId).then(function(conf) {
                    deferred.resolve(conf.getSessionsByPeopleKey(confId, personKey));
                });
                return deferred.promise;
            },
            ItemsByPeopleKey: function(confId, personKey) {
                var deferred = $q.defer();
                ConferenceCache.get(confId).then(function(conf) {
                    deferred.resolve(conf.getItemsByPeopleKey(confId, personKey));
                });
                return deferred.promise;
            }
        };
    }
]);