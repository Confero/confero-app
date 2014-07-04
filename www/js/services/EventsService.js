angular.module('confero.eventsService', ['ngResource'])

.factory('PastEvents', ['$resource', '$cacheFactory',
	function($resource, $cacheFactory) {
		var www = 'http://'+ location.hostname + ':3000';
		var now = moment();
		var res = www + '/conferences/events/past?date=' + now.toISOString();
		return $resource( res, {}, {
			'get' : {method:'GET', cache: $cacheFactory}
		});
	}
])
.factory('UpcomingEvents', ['$resource', '$cacheFactory',
	function($resource, $cacheFactory) {
		var www = 'http://'+ location.hostname + ':3000';
		var now = moment();
		var res = www + "/conferences/events/upcoming?date=" + now.toISOString();
		return $resource( res, {}, {
			'get' : {method:'GET', cache: $cacheFactory}
		});
	}
])
.factory('InProgressEvents', ['$resource', '$cacheFactory',
	function($resource, $cacheFactory) {
		var www = 'http://'+ location.hostname + ':3000';
		var now = moment();
		var res = www + '/conferences/events/inprogress?date=' + now.toISOString();
		return $resource( res, {}, {
			'get' : {method:'GET', cache: $cacheFactory}
		});
	}
]);

