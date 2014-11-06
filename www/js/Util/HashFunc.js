/* ConferoApp.js
 * version : 4.0.1
 * authors : Rylan Cottrell, Reid Holmes
 * license : GNU GPL
 */

function simpleHash(str) {
    "use strict";
    var strCode, hash = 0;
    if(!str) {
        return hash;
    }
    for(var i = 0; i < str.length; i++) {
        strCode = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + strCode;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}