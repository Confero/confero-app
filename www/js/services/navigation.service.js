angular
    .module('confero.app')
    .factory('Navigation', Navigation);

Navigation.$inject = ['$rootScope', '$state'];

function Navigation($rootScope, $state) {
    "use strict";
    var navStack = [];
    $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess(event, toState, toParams, fromState, fromParams) {
        if(navStack && navStack[navStack.length - 1] === 0) {
            navStack.pop();
            return;
        }
        navStack.push({
            state: fromState,
            params: fromParams
        });
    }
    var service = {
        goBack: goBack
    };

    return service;

    ////////////

    function goBack(defaultState, defaultParams) {
        var b = navStack.pop();
        if(b) {
            navStack.push(0);
            $state.go(b.state, b.params);
        } else {
            $state.go(defaultState, defaultParams);
        }
    }
}