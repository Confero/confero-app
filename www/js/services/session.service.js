/* ConferoApp.js
 * version : 4.0.1
 * authors : Rylan Cottrell, Reid Holmes
 * license : GNU GPL
 */

angular
    .module('confero.app')
    .factory('Session', Session);

Session.$inject = ['ConferenceCache', '$q'];

function Session(ConferenceCache, $q) {
    "use strict";
    var service = {
        get: get,
        SessionByPaperKey: SessionByPaperKey
    };

    return service;

    ////////////

    function get(confId, sessionKey) {
        var deferred = $q.defer();
        ConferenceCache.get(confId).then(function(conf) {
            deferred.resolve(conf.getSessionByKey(confId, sessionKey));
        }, function(rejection) {
            console.log(rejection);
        });
        return deferred.promise;
    }

    function SessionByPaperKey(confId, paperKey) {
        var deferred = $q.defer();
        ConferenceCache.get(confId).then(function(conf) {
            deferred.resolve(conf.getSessionByPaperKey(confId, paperKey));
        }, function(rejection) {
            console.log(rejection);
        });
        return deferred.promise;
    }
}