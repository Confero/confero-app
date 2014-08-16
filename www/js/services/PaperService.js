angular.module('confero.PaperService', ['confero.ConferoDataService']).factory('Paper', ['ConferenceCache', '$q',
    function(ConferenceCache, $q) {
        return {
            get: function(confId, paperKey) {
                var deferred = $q.defer();
                ConferenceCache.get(confId).then(function(conf) {
                    deferred.resolve(conf.getItemByKey(confId, paperKey));
                }, function(rejection) {
                    console.log(rejection);
                });
                return deferred.promise;
            }
        };
    }
]);