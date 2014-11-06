/* ConferoApp.js
 * version : 4.0.1
 * authors : Rylan Cottrell, Reid Holmes
 * license : GNU GPL
 */

angular
    .module('confero.app')
    .config(['$compileProvider',
        function($compileProvider) {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|app):/);
            $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|app):/);

        }
    ]);