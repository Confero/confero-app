/* ConferoApp.js
 * version : 4.0.1
 * authors : Rylan Cottrell, Reid Holmes
 * license : GNU GPL
 */

angular
    .module('confero.app')
    .config(['$localForageProvider',
        function($localForageProvider) {
            $localForageProvider.config({
                //driver      : 'localStorageWrapper', // if you want to force a driver
                name: 'Confero', // name of the database and prefix for your data
                version: 1.0, // version of the database, you shouldn't have to use this
                storeName: 'conferoData', // name of the table
                description: 'Confero data store'
            });
            $localForageProvider.setNotify(true, true);
        }
    ]);