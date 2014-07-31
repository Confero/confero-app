angular.module('confero.ConferoDataObjects', [])

.factory('EventsData', [
    function() {
        var eventIndex, eventByKey;
        return {
            setEventsIndex: function(eventsData) {
                eventIndex = eventsData;
                eventByKey = {};
                for(var i = 0; eventIndex.Events[i]; i++) {
                    eventIndex.Events[i].momentStartDate = moment(eventIndex.Events[i].StartDate, "MM/DD/YYYY");
                    eventIndex.Events[i].momentEndDate = moment(eventIndex.Events[i].EndDate, "MM/DD/YYYY");
                    eventIndex.Events[i].momentEndDate.hour(23);
                    eventIndex.Events[i].momentEndDate.minute(59);
                    eventByKey[eventIndex.Events[i].Id] = eventIndex.Events[i];
                }
                eventIndex.Events.sort(function compare(a, b) {
                    if(a.momentEndDate.isAfter(b.momentEndDate)) {
                        return -1;
                    } else if(a.momentEndDate.isBefore(b.momentEndDate)) {
                        return 1;
                    } else {
                        if(a.momentStartDate.isAfter(b.momentStartDate)) {
                            return -1;
                        }
                        if(a.momentStartDate.isBefore(b.momentStartDate)) {
                            return 1;
                        }
                        return 0;
                    }
                });
            },
            getEventIndex: function() {
                return eventIndex;
            },
            getEventById: function(id) {
                if(eventByKey) {
                    return eventByKey[id];
                }
            },
            getEventsByTemporal: function(temporal, date) {
                var events = [];
                if(eventIndex) {
                    for(var i = 0; eventIndex.Events[i]; i++) {
                        if(temporal === "past" && eventIndex.Events[i].momentEndDate.isBefore(date)) {
                            events.push(eventIndex.Events[i]);
                        } else if(temporal === "upcoming" && date.isBefore(eventIndex.Events[i].momentStartDate)) {
                            events.push(eventIndex.Events[i]);
                        } else if(temporal === "inprogress" && (
                            (date.isBefore(eventIndex.Events[i].momentEndDate) || date.isSame(eventIndex.Events[i].momentEndDate)) && (date.isAfter(eventIndex.Events[i].momentStartDate) || date.isSame(eventIndex.Events[i].momentStartDate)))) {
                            events.push(eventIndex.Events[i]);
                        }
                    }
                }
                return events;
            }
        };
    }
]).factory('ConferenceData', [
    function() {
        var confDataCache = {};
        return {
            addConference: function(confId, data, version) {
                var confData = data;
                confData.Version = version;
                confData.Sessions.sort(function compare(a, b) {
                    var atime = a.Time.split('-');
                    var btime = b.Time.split('-');
                    var aStartTime = moment(a.Day + ' ' + atime[0].trim(), 'YYYY-MM-DD HH:mm');
                    var bStartTime = moment(b.Day + ' ' + btime[0].trim(), 'YYYY-MM-DD HH:mm');
                    var aEndTime = moment(a.Day + ' ' + atime[1].trim(), 'YYYY-MM-DD HH:mm');
                    var bEndTime = moment(b.Day + ' ' + btime[1].trim(), 'YYYY-MM-DD HH:mm');
                    if(aStartTime.isAfter(bStartTime)) {
                        return 1;
                    } else if(aStartTime.isBefore(bStartTime)) {
                        return -1;
                    } else {
                        if(aEndTime.isAfter(bEndTime)) {
                            return 1;
                        }
                        if(aEndTime.isBefore(bEndTime)) {
                            return -1;
                        }
                        return 0;
                    }
                });
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
                        for(j = 0; conferenceCache[id].Items[i].Authors[j]; j++) {
                            if(confData.ItemsKeyByPeopleKey[confData.Items[i].Authors[j]]) {
                                confData.ItemsKeyByPeopleKey[confData.Items[i].Authors[j]].push(confData.Items[i].Key);
                            } else {
                                confData.ItemsKeyByPeopleKey[confData.Items[i].Authors[j]] = [confData.Items[i].Key];
                            }
                        }
                    }
                }
                confDataCache[confId] = confData;
            },
            get: function(confId) {
                return confDataCache[confId];
            },
            getPersonByKey: function(confId, peopleKey) {
                if(confDataCache[confId]) {
                    return confDataCache[confId].PeopleByKey[peopleKey];
                }
            },
            getSessionByKey: function(confId, sessionKey) {
                if(confDataCache[confId]) {
                    return confDataCache[confId].SessionsByKey[sessionKey];
                }
            },
            getItemByKey: function(confId, itemKey) {
                if(confDataCache[confId]) {
                    return confDataCache[confId].ItemsByKey[itemKey];
                }
            },
            getSessionByPaperKey: function(confId, paperKey) {
                if(confDataCache[confId]) {
                    return this.getSessionByKey(confId, confDataCache[confId].SessionByPaperKey[paperKey]);
                }
            },
            getItemsByPeopleKey: function(confId, peopleKey) {
                if(confDataCache[confId]) {
                    var itemKeys = confDataCache[confId].ItemsKeyByPeopleKey[peopleKey];
                    var items = [];
                    for(var i = 0; itemKeys[i]; i++) {
                        items.push(this.getItemByKey(confId, itemKeys[i]));
                    }
                    return items;
                }
            },
            getSessionsByPeopleKey: function(confId, peopleKey) {
                if(confDataCache[confId]) {
                    var items = this.getItemsByPeopleKey(confId, peopleKey);
                    var sessions = [];
                    for(var i = 0; items[i]; i++) {
                        sessions.push(this.getSessionByPaperKey(confId, items[i].Key));
                    }
                    return sessions;
                }
            }
        };
    }
]);