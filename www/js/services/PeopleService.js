angular.module('confero.PeopleService', ['confero.ConferoDataService']).factory('People', ['ConferenceCache', '$q',
    function(ConferenceCache, $q) {
        return {
            Person: function(confId, personKey) {
                var deferred = $q.defer();
                ConferenceCache.get(confId).then(function(conf) {
                    deferred.resolve(conf.getPersonByKey(confId, personKey));
                }, function(rejection) {
                    console.log(rejection);
                });
                return deferred.promise;
            },
            SessionsByPeopleKey: function(confId, personKey) {
                var deferred = $q.defer();
                ConferenceCache.get(confId).then(function(conf) {
                    deferred.resolve(conf.getSessionsByPeopleKey(confId, personKey));
                }, function(rejection) {
                    console.log(rejection);
                });
                return deferred.promise;
            },
            ItemsByPeopleKey: function(confId, personKey) {
                var deferred = $q.defer();
                ConferenceCache.get(confId).then(function(conf) {
                    deferred.resolve(conf.getItemsByPeopleKey(confId, personKey));
                }, function(rejection) {
                    console.log(rejection);
                });
                return deferred.promise;
            }
        };
    }
]);