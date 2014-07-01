angular.module('confero.paperService', ['ngResource'])

.factory('Paper', ['$resource', '$cacheFactory',
    function($resource, $cacheFactory) {
        var www = 'http://' + location.hostname + ':3000';
        var res = www + '/conference/:id/item/:key';
        return $resource(res, {}, {
            'get': {
                method: 'GET',
                params: {
                    id: '',
					key:''
                },
                cache: $cacheFactory
            }
        });
    }
]);