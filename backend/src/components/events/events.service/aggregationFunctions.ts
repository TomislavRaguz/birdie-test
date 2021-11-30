import {
  differenceInCalendarDays,
  eachDayOfInterval,
  isAfter,
  isBefore,
  startOfDay,
} from 'date-fns';
import { Events } from '../events.model';
import { BirdieEvent } from '../EventType';
import { EventsAggregateQueryParams } from './exposeAggregates';

export function aggregateEventValuesByDay(
  query: EventsAggregateQueryParams,
  events: Array<Events>
) {
  if (!events.length) return [];

  const startDate = query.timeRangeStart
    ? new Date(query.timeRangeStart)
    : null;
  const endDate = query.timeRangeEnd ? new Date(query.timeRangeEnd) : null;
  const fullEvents = parseBirdieEventsWithDate(events);
  let domainStartDate = startDate ? startOfDay(startDate) : null;
  if (!domainStartDate) {
    const minDate = fullEvents.reduce(
      (minDate, event) =>
        isBefore(event.date, minDate) ? event.date : minDate,
      fullEvents[0].date
    );
    domainStartDate = startOfDay(minDate);
  }
  let domainEndDate = endDate ? startOfDay(endDate) : null;
  if (!domainEndDate) {
    const maxDate = fullEvents.reduce(
      (maxDate, event) => (isAfter(event.date, maxDate) ? event.date : maxDate),
      fullEvents[0].date
    );
    domainEndDate = startOfDay(maxDate);
  }

  const daysEvents = groupEventsByDay(fullEvents, {
    start: domainStartDate!,
    end: domainEndDate!,
  });

  return daysEvents.map((dayEvents) => ({
    date: dayEvents.day,
    fluidIntake: fluidIntakeReducer(dayEvents.events),
    mood: moodReducer(dayEvents.events),
    foodIntake: foodIntakeReducer(dayEvents.events),
  }));
}

export function fluidIntakeReducer(dayEvents: Array<BirdieEvent>) {
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

export function moodReducer(dayEvents: Array<BirdieEvent>) {
  const moodMap: Record<string, number> = {};
  let totalMoodReadings = 0;

  dayEvents.forEach((event) => {
    if (event.event_type === 'mood_observation') {
      totalMoodReadings++;
      if (!moodMap[event.mood]) {
        moodMap[event.mood] = 1;
      } else {
        moodMap[event.mood]++;
      }
    }
  });

  const moodFrequencyMap: Record<string, number> = {};
  for (const [moodKey, nReadings] of Object.entries(moodMap)) {
    moodFrequencyMap[moodKey] = nReadings / totalMoodReadings;
  }

  return { totalMoodReadings, ...moodFrequencyMap };
}

export function foodIntakeReducer(dayEvents: Array<BirdieEvent>) {
  const foodObservationEvents: Array<{
    type: string;
    note: string;
    timestamp: string;
  }> = [];

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

export function groupEventsByDay(
  events: Array<BirdieEvent & { date: Date }>,
  domain: { start: Date; end: Date }
) {
  const daysEvents: Array<{ day: Date; events: Array<BirdieEvent> }> =
    eachDayOfInterval(domain).map((day) => ({
      day: startOfDay(day),
      events: [],
    }));
  events.forEach((event) => {
    const diff = differenceInCalendarDays(event.date, domain.start);
    daysEvents[diff].events.push(event);
  });
  return daysEvents;
}

function parseBirdieEventsWithDate(
  eventPayloads: Array<{ payload: string }>
): Array<BirdieEvent & { date: Date }> {
  return eventPayloads.map(({ payload }) => {
    const obj = JSON.parse(payload);
    obj.date = new Date(obj.timestamp);
    return obj;
  });
}
