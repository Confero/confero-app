angular
    .module('confero.app')
    .factory('Paper', Paper);

Paper.$inject = ['ConferenceCache', '$q'];

function Paper(ConferenceCache, $q) {
    "use strict";

    var service = {
        get: get
    };

    return service;

    ////////////

    function get(confId, paperKey) {
        var deferred = $q.defer();
        ConferenceCache.get(confId).then(function(conf) {
            deferred.resolve(conf.getItemByKey(confId, paperKey));
        }, function(rejection) {
            console.log(rejection);
        });
        return deferred.promise;
    }
}