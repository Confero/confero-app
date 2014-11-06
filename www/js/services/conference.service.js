/* ConferoApp.js
 * version : 4.0.1
 * authors : Rylan Cottrell, Reid Holmes
 * license : GNU GPL
 */
angular
    .module('confero.app')
    .factory('Conference', Conference);

Conference.$inject = ['ConferenceCache', '$q'];

function Conference(ConferenceCache, $q) {
    "use strict";
    var confInfoCache = {};
    var service = {
        People: People,
        Sessions: Sessions,
        Papers: Papers,
        Info: Info
    };
    return service;


    function People(confId) {
        var deferred = $q.defer();
        ConferenceCache.get(confId).then(function(conference) {
            deferred.resolve(conference.get(confId).People);
        }, function(rejection) {
            console.log(rejection);
        });
        return deferred.promise;
    }

    function Sessions(confId) {
        var deferred = $q.defer();
        ConferenceCache.get(confId).then(function(conference) {
            deferred.resolve(conference.get(confId).Sessions);
        }, function(rejection) {
            console.log(rejection);
        });
        return deferred.promise;
    }

    function Papers(confId) {
        var deferred = $q.defer();
        ConferenceCache.get(confId).then(function(conference) {
            deferred.resolve(conference.get(confId).Items);
        }, function(rejection) {
            console.log(rejection);
        });
        return deferred.promise;
    }

    function Info(confId) {
        var deferred = $q.defer();
        if(confInfoCache[confId]) {
            deferred.resolve(confInfoCache[confId]);
        } else {
            ConferenceCache.get(confId).then(function(conf) {
                var info = {};
                var conference = conf.get(confId);
                for(var i in conference) {
                    if(conference.hasOwnProperty(i) &&
                        i !== "Sessions" &&
                        i !== "SessionsByKey" &&
                        i !== "Items" &&
                        i !== "ItemsByKey" &&
                        i !== "People" &&
                        i !== "PeopleByKey"
                    ) {
                        info[i] = conference[i];
                    }
                }
                confInfoCache[confId] = info;
                deferred.resolve(info);
            });
        }
        return deferred.promise;
    }
}