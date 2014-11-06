/* ConferoApp.js
 * version : 4.0.1
 * authors : Rylan Cottrell, Reid Holmes
 * license : GNU GPL
 */

angular.module('jm.i18next').config(['$i18nextProvider',
    function($i18nextProvider) {
        $i18nextProvider.options = {
            lng: navigator.language,
            useCookie: false,
            useLocalStorage: false,
            fallbackLng: 'en',
            resGetPath: './locales/__lng__/__ns__.json',
            defaultLoadingValue: '' // ng-i18next option, *NOT* directly supported by i18next
        };
    }
]);

moment.locale(navigator.language);

angular
    .module('confero.app', [
        'ionic',
        'ngResource',
        'ui.router',
        'LocalForageModule',
        'jm.i18next'
    ])
    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    });