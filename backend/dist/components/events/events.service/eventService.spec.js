"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aggregationFunctions_1 = require("./aggregationFunctions");
describe('events service', () => {
    describe('aggregate funtions', () => {
        test(`fluidIntakeReducer`, () => {
            const events = [
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
            expect((0, aggregationFunctions_1.fluidIntakeReducer)(events)).toEqual({
                totalFluidIntake: 300,
                regularFluidIntake: 200,
                caffeinatedFluidIntake: 100,
            });
        });
        test(`moodReducer`, () => {
            const events = [
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
            expect((0, aggregationFunctions_1.moodReducer)(events)).toEqual({
                totalMoodReadings: 3,
                happy: 2 / 3,
                sad: 1 / 3,
            });
        });
        test(`foodIntakeReducer`, () => { });
        test(`groupEventsByDay`, () => {
        });
        test(`aggregateEventValuesByDay`, () => {
        });
    });
});
