angular.module('confero.StarredService', ['LocalForageModule']).factory('Starred', ['$localForage', '$q',
    function($localForage, $q) {
        var starred = {};
        var prefix = "starred_";
        return {
            toggleStar: function(confId, key) {
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
                    });
                } else {
                    starred[confId][key] = !starred[confId][key];
                    deferred.resolve(starred[confId][key]);
                    $localForage.setItem(prefix + confId, starred[confId]);
                }
                return deferred.promise;
            },
            get: function(confId, key) {
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
        };
    }
]);