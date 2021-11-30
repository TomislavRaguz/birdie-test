//import { BirdieEvent } from '../EventType';
import {
  fluidIntakeReducer,
  //foodIntakeReducer,
  moodReducer,
  //groupEventsByDay,
  //aggregateEventValuesByDay
} from './aggregationFunctions';

describe('events service', () => {
  describe('aggregate funtions', () => {
    test(`fluidIntakeReducer`, () => {
      const events: Array<any> = [
        {
          event_type: 'fluid_intake_observation',
          consumed_volume_ml: 100,
          fluid: 'regular',
        },
        {
          event_type: 'fluid_intake_observation',
          consumed_volume_ml: 100,
          fluid: 'regular',
        },
        {
          event_type: 'fluid_intake_observation',
          consumed_volume_ml: 100,
          fluid: 'caffeinated',
        },
      ];
      expect(fluidIntakeReducer(events)).toEqual({
        totalFluidIntake: 300,
        regularFluidIntake: 200,
        caffeinatedFluidIntake: 100,
      });
    });
    test(`moodReducer`, () => {
      const events: Array<any> = [
        {
          event_type: 'mood_observation',
          mood: 'happy',
        },
        {
          event_type: 'mood_observation',
          mood: 'happy',
        },
        {
          event_type: 'mood_observation',
          mood: 'sad',
        },
      ];
      expect(moodReducer(events)).toEqual({
        totalMoodReadings: 3,
        happy: 2 / 3,
        sad: 1 / 3,
      });
    });
    test(`foodIntakeReducer`, () => {});

    test(`groupEventsByDay`, () => {
      //groupEventsByDay
    });
    test(`aggregateEventValuesByDay`, () => {
      //aggregateEventValuesByDay
    });
  });
});
