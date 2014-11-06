/* ConferoApp.js
 * version : 4.0.1
 * authors : Rylan Cottrell, Reid Holmes
 * license : GNU GPL
 */

angular
    .module('confero.app')
    .factory('People', People);

People.$inject = ['ConferenceCache', '$q'];

function People(ConferenceCache, $q) {
    "use strict";
    var service = {
        Person: Person,
        SessionsByPeopleKey: SessionsByPeopleKey,
        ItemsByPeopleKey: ItemsByPeopleKey
    };

    return service;

    ////////////

    function Person(confId, personKey) {
        var deferred = $q.defer();
        ConferenceCache.get(confId).then(function(conf) {
            deferred.resolve(conf.getPersonByKey(confId, personKey));
        }, function(rejection) {
            console.log(rejection);
        });
        return deferred.promise;
    }

    function SessionsByPeopleKey(confId, personKey) {
        var deferred = $q.defer();
        ConferenceCache.get(confId).then(function(conf) {
            deferred.resolve(conf.getSessionsByPeopleKey(confId, personKey));
        }, function(rejection) {
            console.log(rejection);
        });
        return deferred.promise;
    }

    function ItemsByPeopleKey(confId, personKey) {
        var deferred = $q.defer();
        ConferenceCache.get(confId).then(function(conf) {
            deferred.resolve(conf.getItemsByPeopleKey(confId, personKey));
        }, function(rejection) {
            console.log(rejection);
        });
        return deferred.promise;
    }
}