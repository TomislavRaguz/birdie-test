"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupEventsByDay = exports.foodIntakeReducer = exports.moodReducer = exports.fluidIntakeReducer = exports.aggregateEventValuesByDay = void 0;
const date_fns_1 = require("date-fns");
function aggregateEventValuesByDay(query, events) {
    if (!events.length)
        return [];
    const startDate = query.timeRangeStart
        ? new Date(query.timeRangeStart)
        : null;
    const endDate = query.timeRangeEnd ? new Date(query.timeRangeEnd) : null;
    const fullEvents = parseBirdieEventsWithDate(events);
    let domainStartDate = startDate ? (0, date_fns_1.startOfDay)(startDate) : null;
    if (!domainStartDate) {
        const minDate = fullEvents.reduce((minDate, event) => (0, date_fns_1.isBefore)(event.date, minDate) ? event.date : minDate, fullEvents[0].date);
        domainStartDate = (0, date_fns_1.startOfDay)(minDate);
    }
    let domainEndDate = endDate ? (0, date_fns_1.startOfDay)(endDate) : null;
    if (!domainEndDate) {
        const maxDate = fullEvents.reduce((maxDate, event) => ((0, date_fns_1.isAfter)(event.date, maxDate) ? event.date : maxDate), fullEvents[0].date);
        domainEndDate = (0, date_fns_1.startOfDay)(maxDate);
    }
    const daysEvents = groupEventsByDay(fullEvents, {
        start: domainStartDate,
        end: domainEndDate,
    });
    return daysEvents.map((dayEvents) => ({
        date: dayEvents.day,
        fluidIntake: fluidIntakeReducer(dayEvents.events),
        mood: moodReducer(dayEvents.events),
        foodIntake: foodIntakeReducer(dayEvents.events),
    }));
}
exports.aggregateEventValuesByDay = aggregateEventValuesByDay;
function fluidIntakeReducer(dayEvents) {
    let totalFluidIntake = 0;
    let regularFluidIntake = 0;
    let caffeinatedFluidIntake = 0;
    dayEvents.forEach((event) => {
        if (event.event_type === 'fluid_intake_observation') {
            totalFluidIntake += event.consumed_volume_ml;
            if (event.fluid === 'regular')
                regularFluidIntake += event.consumed_volume_ml;
            if (event.fluid === 'caffeinated')
                caffeinatedFluidIntake += event.consumed_volume_ml;
        }
    });
    return { totalFluidIntake, regularFluidIntake, caffeinatedFluidIntake };
}
exports.fluidIntakeReducer = fluidIntakeReducer;
function moodReducer(dayEvents) {
    const moodMap = {};
    let totalMoodReadings = 0;
    dayEvents.forEach((event) => {
        if (event.event_type === 'mood_observation') {
            totalMoodReadings++;
            if (!moodMap[event.mood]) {
                moodMap[event.mood] = 1;
            }
            else {
                moodMap[event.mood]++;
            }
        }
    });
    const moodFrequencyMap = {};
    for (const [moodKey, nReadings] of Object.entries(moodMap)) {
        moodFrequencyMap[moodKey] = nReadings / totalMoodReadings;
    }
    return { totalMoodReadings, ...moodFrequencyMap };
}
exports.moodReducer = moodReducer;
function foodIntakeReducer(dayEvents) {
    const foodObservationEvents = [];
    dayEvents.forEach((event) => {
        if (event.event_type === 'food_intake_observation') {
            foodObservationEvents.push({
                type: event.meal,
                note: event.note,
                timestamp: event.timestamp,
            });
        }
    });
    return foodObservationEvents;
}
exports.foodIntakeReducer = foodIntakeReducer;
function groupEventsByDay(events, domain) {
    const daysEvents = (0, date_fns_1.eachDayOfInterval)(domain).map((day) => ({
        day: (0, date_fns_1.startOfDay)(day),
        events: [],
    }));
    events.forEach((event) => {
        const diff = (0, date_fns_1.differenceInCalendarDays)(event.date, domain.start);
        daysEvents[diff].events.push(event);
    });
    return daysEvents;
}
exports.groupEventsByDay = groupEventsByDay;
function parseBirdieEventsWithDate(eventPayloads) {
    return eventPayloads.map(({ payload }) => {
        const obj = JSON.parse(payload);
        obj.date = new Date(obj.timestamp);
        return obj;
    });
}
