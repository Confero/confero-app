angular.module('confero.ConferoDataObjects', []).factory('EventsData', [
    function() {
        var eventIndex, eventByKey;
        return {
            setEventsIndex: function(eventsData) {
                eventIndex = eventsData;
                eventByKey = {};
                for(var i = 0; eventIndex.Events[i]; i++) {
                    eventIndex.Events[i].momentStartDate = moment(eventIndex.Events[i].StartDate, "YYYY-MM-DD");
                    eventIndex.Events[i].momentEndDate = moment(eventIndex.Events[i].EndDate, "YYYY-MM-DD");
                    eventIndex.Events[i].momentEndDate.hour(23);
                    eventIndex.Events[i].momentEndDate.minute(59);
                    eventByKey[eventIndex.Events[i].Id] = eventIndex.Events[i];
                    eventIndex.Events[i].StartDatePretty = eventIndex.Events[i].momentStartDate.format("MMMM D, YYYY");
                    eventIndex.Events[i].EndDatePretty = eventIndex.Events[i].momentEndDate.format("MMMM D, YYYY");
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
                angular.forEach(confData.Sessions, function(value, index){
                     var atime = value.Time.split('-');
                     value.StartTime = moment(value.Day + ' ' + atime[0].trim(), 'YYYY-MM-DD HH:mm');
                     value.EndTime = moment(value.Day + ' ' + atime[1].trim(), 'YYYY-MM-DD HH:mm');
                });
                confData.Sessions.sort(SortByDate);
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
            },
            get: function(confId) {
                return confDataCache[confId];
            },
            resolveKey: function(confId, key) {
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