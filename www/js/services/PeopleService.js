angular.module('confero.peopleService', ['ngResource'])

.factory('Person', ['$resource', '$cacheFactory',
    function($resource, $cacheFactory) {
        var www = 'http://' + location.hostname + ':3000';
        var res = www + '/conference/:id/people/:key';
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