angular.module('confero.NavigationService', []).factory('Navigation', ['$rootScope', '$state',
    function($rootScope, $state) {
        var navStack = [];
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if(navStack && navStack[navStack.length - 1] === 0) {
				navStack.pop();
				return;
			}
			navStack.push({state: fromState, params: fromParams});
        });
		
        return {
            goBack: function(defaultState, defaultParams) {
                var b = navStack.pop();
                if(b) {
                    navStack.push(0);
                    $state.go(b.state, b.params);
                } else {
                    $state.go(defaultState, defaultParams);
                }
            }
        };
    }
]);