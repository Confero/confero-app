angular.module('confero.conferenceService', ['ngResource'])

.factory('Sessions', ['$resource', '$cacheFactory',
	function($resource, $cacheFactory) {
		var www = 'http://'+ location.hostname + ':3000';
		var res = www + '/conference/:id/sessions';
		return $resource( res, {}, {
			'get' : {method:'GET', params:{id:''}, cache: $cacheFactory}
		});
	}
])

.factory('People', ['$resource', '$cacheFactory',
	function($resource, $cacheFactory) {
		var www = 'http://'+ location.hostname + ':3000';
		var res = www + '/conference/:id/people';
		return $resource( res, {}, {
			'get' : {method:'GET', params:{id:''}, cache: $cacheFactory}
		});
	}
]);

