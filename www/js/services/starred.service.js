angular
    .module('confero.app')
    .factory('Starred', Starred);

Starred.$inject = ['$localForage', '$q'];

function Starred($localForage, $q) {
    "use strict";
    var starred = {};
    var prefix = "starred_";
    var service = {
        toggleStar: toggleStar,
        get: get
    };
    return service;

    ////////////

    function toggleStar(confId, key) {
        var deferred = $q.defer();
        if(!starred[confId]) {
            $localForage.getItem(prefix + confId).then(function(value) {
                starred[confId] = {};
                if(value) {
                    starred[confId] = value;
                }
                starred[confId][key] = !starred[confId][key];
                deferred.resolve(starred[confId][key]);
                $localForage.setItem(prefix + confId, starred[confId]);
            }, function(rejection) {
                console.log(rejection);
            });
        } else {
            starred[confId][key] = !starred[confId][key];
            deferred.resolve(starred[confId][key]);
            $localForage.setItem(prefix + confId, starred[confId]);
        }
        return deferred.promise;
    }

    function get(confId, key) {
        var deferred = $q.defer();
        if(!starred[confId]) {
            $localForage.getItem(prefix + confId).then(function(value) {
                starred[confId] = {};
                if(value) {
                    starred[confId] = value;
                }
                if(key) {
                    deferred.resolve(starred[confId][key]);
                } else {
                    deferred.resolve(starred[confId]);
                }
            }, function(rejection) {
                console.log(rejection);
            });
        } else {
            if(key) {
                deferred.resolve(starred[confId][key]);
            } else {
                deferred.resolve(starred[confId]);
            }
        }
        return deferred.promise;
    }
}