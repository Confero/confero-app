/* ConferoApp.js
 * version : 4.0.1
 * authors : Rylan Cottrell, Reid Holmes
 * license : GNU GPL
 */

angular
    .module('confero.app')
    .factory('ConferenceData', ConferenceData);

function ConferenceData() {
    "use strict";
    var confDataCache = {};

    var service = {
        addConference: addConference,
        get: get,
        resolveKey: resolveKey,
        getPersonByKey: getPersonByKey,
        getSessionByKey: getSessionByKey,
        getItemByKey: getItemByKey,
        getSessionByPaperKey: getSessionByPaperKey,
        getItemsByPeopleKey: getItemsByPeopleKey,
        getSessionsByPeopleKey: getSessionsByPeopleKey
    };

    return service;

    function addConference(confId, data, version) {
        var confData = data;
        confData.Version = version;
        angular.forEach(confData.Sessions, function(value, index) {
            var atime = value.Time ? value.Time.split('-') : ['00:00', '23:59'];
            if(atime[0].indexOf('m') > -1) { //old standard
                value.StartTime = moment(value.Day + ' ' + atime[0].trim(), 'MM-DD-YYYY HH:mm a');
                if(!atime[1]) {
                    atime[1] = "11:59 pm";
                }
                value.EndTime = moment(value.Day + ' ' + atime[1].trim(), 'MM-DD-YYYY HH:mm a');
            } else { //new standard
                value.StartTime = moment(value.Day + ' ' + atime[0].trim(), 'YYYY-MM-DD HH:mm');
                value.EndTime = moment(value.Day + ' ' + atime[1].trim(), 'YYYY-MM-DD HH:mm');
            }
        });
        var i, j;
        confData.Sessions.sort(sortByDate);
        if(!confData.PeopleByKey) {
            confData.PeopleByKey = {};
            for(i = 0; confData.People[i]; i++) {
                confData.PeopleByKey[confData.People[i].Key] = confData.People[i];
            }
        }
        if(!confData.SessionsByKey) {
            confData.SessionsByKey = {};
            confData.SessionByPaperKey = {};
            for(i = 0; confData.Sessions[i]; i++) {
                confData.SessionsByKey[confData.Sessions[i].Key] = confData.Sessions[i];
                if(confData.Sessions[i].Items) {
                    for(j = 0; confData.Sessions[i].Items[j]; j++) {
                        confData.SessionByPaperKey[confData.Sessions[i].Items[j]] = confData.Sessions[i].Key;
                    }
                }
            }
        }
        if(!confData.ItemsByKey) {
            confData.ItemsKeyByPeopleKey = {};
            confData.ItemsByKey = {};
            for(i = 0; confData.Items[i]; i++) {
                confData.ItemsByKey[confData.Items[i].Key] = confData.Items[i];
                for(j = 0; confData.Items[i].Authors[j]; j++) {
                    if(confData.ItemsKeyByPeopleKey[confData.Items[i].Authors[j]]) {
                        confData.ItemsKeyByPeopleKey[confData.Items[i].Authors[j]].push(confData.Items[i].Key);
                    } else {
                        confData.ItemsKeyByPeopleKey[confData.Items[i].Authors[j]] = [confData.Items[i].Key];
                    }
                }
            }
        }
        confDataCache[confId] = confData;
    }

    function get(confId) {
        return confDataCache[confId];
    }

    function resolveKey(confId, key) {
        if(confDataCache[confId]) {
            if(confDataCache[confId].PeopleByKey[key]) {
                return {
                    person: confDataCache[confId].PeopleByKey[key]
                };
            } else if(confDataCache[confId].SessionsByKey[key]) {
                return {
                    session: confDataCache[confId].SessionsByKey[key]
                };
            } else if(confDataCache[confId].ItemsByKey[key]) {
                return {
                    item: confDataCache[confId].ItemsByKey[key]
                };
            }
        }
    }

    function getPersonByKey(confId, peopleKey) {
        if(confDataCache[confId]) {
            return confDataCache[confId].PeopleByKey[peopleKey];
        }
    }

    function getSessionByKey(confId, sessionKey) {
        if(confDataCache[confId]) {
            return confDataCache[confId].SessionsByKey[sessionKey];
        }
    }

    function getItemByKey(confId, itemKey) {
        if(confDataCache[confId]) {
            return confDataCache[confId].ItemsByKey[itemKey];
        }
    }

    function getSessionByPaperKey(confId, paperKey) {
        if(confDataCache[confId]) {
            return getSessionByKey(
                confId,
                confDataCache[confId].SessionByPaperKey[paperKey]
            );
        }
    }

    function getItemsByPeopleKey(confId, peopleKey) {
        if(confDataCache[confId]) {
            var itemKeys = confDataCache[confId].ItemsKeyByPeopleKey[peopleKey];
            var items = [];
            itemKeys.forEach(addItemsByKey);

            return items;
        }
        /////

        function addItemsByKey(item) {
            items.push(getItemByKey(confId, item));
        }
    }

    function getSessionsByPeopleKey(confId, peopleKey) {
        if(confDataCache[confId]) {
            var items = getItemsByPeopleKey(confId, peopleKey);
            var sessions = [];
            items.forEach(addSessions);

            return sessions;
        }
        /////

        function addSessions(item) {
            sessions.push(getSessionByPaperKey(confId, item.Key));
        }
    }
}