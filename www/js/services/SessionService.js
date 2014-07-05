angular.module('confero.sessionService', ['ngResource'])

.factory('Session', ['$resource', '$cacheFactory',
    function($resource, $cacheFactory) {
        var www = 'http://' + location.hostname + ':3000';
        var res = www + '/conference/:id/session/:key';
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
])
.factory('SessionByPaperKey', ['$resource', '$cacheFactory',
    function($resource, $cacheFactory) {
        var www = 'http://' + location.hostname + ':3000';
		var res = www + '/conference/:id/session?paperkey=:paperkey';
        return $resource(res, {}, {
            'get': {
                method: 'GET',
                params: {
                    id: '',
					paperkey:''
                },
                cache: $cacheFactory
            }
        });
    }
]);