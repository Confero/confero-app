angular.module('confero.eventsService', ['confero.ConferoDataService'])

.factory('EventsIndex', ['EventsCache', '$q',
	function(EventsCache, $q) {
		
		return {
			
			Past: function() {
				var deferred = $q.defer();
				EventsCache.get().then(function(eventsIndex){
					var now = moment();
					deferred.resolve(eventsIndex.getEventsByTemporal('past', now));
				});
				
				return deferred.promise;
			},
			UpComing: function(){
				var deferred = $q.defer();
				EventsCache.get().then(function(eventsIndex){
					var now = moment();
					deferred.resolve(eventsIndex.getEventsByTemporal('upcoming', now));
				});
				
				return deferred.promise;
			},
			InProgress: function(){
				var deferred = $q.defer();
				EventsCache.get().then(function(eventsIndex){
					var now = moment();
					deferred.resolve(eventsIndex.getEventsByTemporal('inprogress', now));
				});
				
				return deferred.promise;
			}
		};
	}]);