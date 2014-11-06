/* ConferoApp.js
 * version : 4.0.1
 * authors : Rylan Cottrell, Reid Holmes
 * license : GNU GPL
 */

angular
    .module('confero.app')
    .factory('EventsData', EventsData);

function EventsData() {
    "use strict";
    var eventIndex, eventByKey;

    var service = {
        setEventsIndex: setEventsIndex,
        getEventIndex: getEventIndex,
        getEventById: getEventById,
        getEventsByTemporal: getEventsByTemporal
    };

    return service;

    function setEventsIndex(eventsData) {
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
    }

    function getEventIndex() {
        return eventIndex;
    }

    function getEventById(id) {
        if(eventByKey) {
            return eventByKey[id];
        }
    }

    function getEventsByTemporal(temporal, date) {
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
}