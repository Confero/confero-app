angular.module('confero.eventsService', ['ngResource'])

.factory('Events', ['$resource', '$cacheFactory',
	function($resource, $cacheFactory) {
		var www = 'http://'+ location.hostname + ':3000';
		return $resource( www + '/conferences/events', {}, {
			'get' : {method:'GET', cache: $cacheFactory}
		});
	}
]);
