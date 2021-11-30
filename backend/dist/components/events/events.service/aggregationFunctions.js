"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupEventsByDay = exports.foodIntakeReducer = exports.moodReducer = exports.fluidIntakeReducer = exports.aggregateEventValuesByDay = void 0;
const date_fns_1 = require("date-fns");
function aggregateEventValuesByDay(query, events) {
    if (!events.length)
        return [];
    const startDate = query.timeRangeStart
        ? (0, date_fns_1.parseISO)(query.timeRangeStart)
        : null;
    const endDate = query.timeRangeEnd ? (0, date_fns_1.parseISO)(query.timeRangeEnd) : null;
    const fullEvents = parseBirdieEventsWithDate(events);
    const domainStartDate = startDate ? startDate : fullEvents.reduce((minDate, event) => (0, date_fns_1.isBefore)(event.date, minDate) ? event.date : minDate, fullEvents[0].date);
    const domainEndDate = endDate ? endDate : fullEvents.reduce((maxDate, event) => ((0, date_fns_1.isAfter)(event.date, maxDate) ? event.date : maxDate), fullEvents[0].date);
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
    const intervals = {};
    events.forEach(event => {
        const intervalN = Math.floor((+event.date - +domain.start) / (1000 * 60 * 60 * 24));
        if (!intervals[intervalN]) {
            intervals[intervalN] = [event];
        }
        else {
            intervals[intervalN].push(event);
        }
    });
    const daysEvents = [];
    for (let [interval, events] of Object.entries(intervals)) {
        const intervalStart = (0, date_fns_1.addDays)(domain.start, parseInt(interval));
        daysEvents.push({ day: intervalStart, events });
    }
    return daysEvents;
}
exports.groupEventsByDay = groupEventsByDay;
function parseBirdieEventsWithDate(eventPayloads) {
    return eventPayloads.map(({ payload }) => {
        const obj = JSON.parse(payload);
        obj.date = (0, date_fns_1.parseISO)(obj.timestamp);
        return obj;
    });
}
