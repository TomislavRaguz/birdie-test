"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const application_1 = require("../../application");
const typeORM_1 = require("../../singletons/typeORM");
describe('events integration', () => {
    let connectionCleanup;
    beforeAll(async () => {
        connectionCleanup = await (0, typeORM_1.typeORMConnectionLoader)();
    });
    afterAll(async () => {
        connectionCleanup();
    });
    describe('GET /v1/events', () => {
        test(`
    Given a request 
      from an unauthenticated user
    then response
      status code must be 401
      and response body must be an error payload`, async () => { });
        test(`
    Given a request 
      from a private user
      and a careRecipientId query parameter is provided
      and the care recipient id is related to the user
    then response
      status code must be 200
      and response body must be an array of events`, async () => {
            const res = await request(application_1.default).get('/api/v1/events/?careRecipientId=df50cac5-293c-490d-a06c-ee26796f850d');
            expect(res.status).toEqual(200);
            expect(res.body).toEqual(expect.arrayContaining(TEST_EVENTS));
        });
        test(`
    Given a request 
      from a private user
      and a careRecipientId query parameter is provided
      and the care recipient id is not related to the user
    then response
      status code must be 403
      and response body must be an error payload`, async () => { });
        test(`
    Given a request 
      and a timeRangeStart 
      or a timesRangeStart query parameter is provided
    then response
      status code must be 200
      and response body must contain an array of events within the time range`, async () => {
            const res = await request(application_1.default).get(`/api/v1/events?careRecipientId=df50cac5-293c-490d-a06c-ee26796f850d&timeRangeStart=${encodeURIComponent(TEST_EVENTS[0].timestamp)}`);
            expect(res.status).toEqual(200);
            expect(res.body).toEqual(expect.arrayContaining([TEST_EVENTS[0]]));
            expect(res.body).toEqual(expect.not.arrayContaining([TEST_EVENTS[1]]));
        });
        test(`
    Given a request 
      and an eventType parameter
      or multiple eventType parameters are provided
    then response
      status code must be 200
      and response body must contain an array of events of the provided type/s`, async () => {
            const res = await request(application_1.default).get('/api/v1/events/?careRecipientId=df50cac5-293c-490d-a06c-ee26796f850d');
            expect(res.status).toEqual(200);
            expect(res.body).toEqual(expect.arrayContaining(TEST_EVENTS));
        });
        test(`
    Given a request 
      and a limit query parameter is provided
    then response
      status code must be 200
      and response body must contain an array of events of the provided length`, async () => {
            const res = await request(application_1.default).get('/api/v1/events/?careRecipientId=df50cac5-293c-490d-a06c-ee26796f850d&limit=1');
            expect(res.status).toEqual(200);
            expect(res.body.length).toEqual(1);
            expect(res.body).toEqual(expect.arrayContaining([TEST_EVENTS[0]]));
        });
        test(`
    Given a request 
      and an offset query parameter is provided
    then response
      status code must be 200
      and response body must not contain the first test event`, async () => {
            const res = await request(application_1.default).get('/api/v1/events/?careRecipientId=df50cac5-293c-490d-a06c-ee26796f850d&skip=1');
            expect(res.status).toEqual(200);
            expect(res.body[0]).toEqual(TEST_EVENTS[1]);
        });
        test(`
    Given a request 
      and some of the provided query parameters are invalid
    then response
      status code must be 400
      and response body must contain an error payload`, async () => {
            const res = await request(application_1.default).get('/api/v1/events/?careRecipientId=df50cac5-293c-490d-a06c-ee26796f850d&skip=foo');
            expect(res.status).toEqual(400);
            expect(res.body).toEqual({
                code: 'VALIDATION_ERROR',
                HTTPStatusCode: 400,
                extensions: expect.anything(),
            });
        });
    });
    describe('GET /v1/events/aggregate', () => {
        test(`
    Given a request 
      from an unauthenticated user
    then response
      status code must be 401
      and response body must be an error payload`, async () => { });
        test(`
    Given a request 
      from a private user
      and a careRecipientId query parameter is provided
      and the care recipient id is related to the user
    then response
      status code must be 200
      and response body must be an object containing event agregates`, async () => {
            const res = await request(application_1.default).get('/api/v1/events/aggregate?careRecipientId=df50cac5-293c-490d-a06c-ee26796f850d');
            expect(res.status).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({
                byDay: expect.arrayContaining([
                    {
                        date: expect.any(String),
                        mood: expect.anything(),
                        fluidIntake: expect.anything(),
                        foodIntake: expect.anything(),
                    },
                ]),
            }));
        });
        test(`
    Given a request 
      and a timeRangeStart 
      or a timesRangeStart query parameter is provided
    then response
      status code must be 200
      and response body must contain an object containing values aggregated from events within the time range`, async () => {
            const res = await request(application_1.default).get('/api/v1/events/aggregate?careRecipientId=df50cac5-293c-490d-a06c-ee26796f850d&timeRangeStart=2019-05-12T18%3A30%3A07.000Z');
            expect(res.status).toEqual(200);
            expect(res.body).toEqual(expect.objectContaining({
                byDay: expect.arrayContaining([
                    {
                        date: expect.any(String),
                        mood: expect.anything(),
                        fluidIntake: expect.anything(),
                        foodIntake: expect.anything(),
                    },
                ]),
            }));
        });
    });
});
const TEST_EVENTS = [
    {
        id: '31c03a75-01bd-4f8c-8a0a-bc343adb622e',
        payload: '{"id": "31c03a75-01bd-4f8c-8a0a-bc343adb622e", "visit_id": "5cd753f0-8b66-f8a8-43f7-330f62a3e1d6", "timestamp": "2019-05-12T19:30:07+01:00", "event_type": "regular_medication_taken", "caregiver_id": "f7a00df5-bbc4-4ad7-9918-c07e16e709f6", "medication_type": "SCHEDULED", "task_instance_id": "bXxlODRjZmI4My1hZjhlLTRlMzEtOGYxZS1kZWNiMjcxNDg3OTZ8MjAxOS0wNS0xMlQxOTowMDowMC4wMDBa", "care_recipient_id": "df50cac5-293c-490d-a06c-ee26796f850d"}',
        alertId: null,
        taskInstanceId: 'bXxlODRjZmI4My1hZjhlLTRlMzEtOGYxZS1kZWNiMjcxNDg3OTZ8MjAxOS0wNS0xMlQxOTowMDowMC4wMDBa',
        visitId: '5cd753f0-8b66-f8a8-43f7-330f62a3e1d6',
        caregiverId: 'f7a00df5-bbc4-4ad7-9918-c07e16e709f6',
        payloadAsText: '{"id": "31c03a75-01bd-4f8c-8a0a-bc343adb622e", "visit_id": "5cd753f0-8b66-f8a8-43f7-330f62a3e1d6", "timestamp": "2019-05-12T19:30:07+01:00", "event_type": "regular_medication_taken", "caregiver_id": "f7a00df5-bbc4-4ad7-9918-c07e16e709f6", "medication_type": "SCHEDULED", "task_instance_id": "bXxlODRjZmI4My1hZjhlLTRlMzEtOGYxZS1kZWNiMjcxNDg3OTZ8MjAxOS0wNS0xMlQxOTowMDowMC4wMDBa", "care_recipient_id": "df50cac5-293c-490d-a06c-ee26796f850d"}',
        rejectedEventId: null,
        observationEventId: null,
        timestamp: '2019-05-12T19:30:07+01:00',
        eventType: 'regular_medication_taken',
        careRecipientId: 'df50cac5-293c-490d-a06c-ee26796f850d',
    },
    {
        id: '5b044315-01a5-4879-9059-523733fdb33c',
        payload: '{"id": "5b044315-01a5-4879-9059-523733fdb33c", "visit_id": "5cd753f0-8b66-f8a8-43f7-330f62a3e1d6", "timestamp": "2019-05-12T19:30:01+01:00", "event_type": "regular_medication_taken", "caregiver_id": "f7a00df5-bbc4-4ad7-9918-c07e16e709f6", "medication_type": "SCHEDULED", "task_instance_id": "bXw3YmU3M2M3NC0zYzZkLTQ2ZjQtYWViMC01YzJmNTczMThiYWF8MjAxOS0wNS0xMlQxOTowMDowMC4wMDBa", "care_recipient_id": "df50cac5-293c-490d-a06c-ee26796f850d"}',
        alertId: null,
        taskInstanceId: 'bXw3YmU3M2M3NC0zYzZkLTQ2ZjQtYWViMC01YzJmNTczMThiYWF8MjAxOS0wNS0xMlQxOTowMDowMC4wMDBa',
        visitId: '5cd753f0-8b66-f8a8-43f7-330f62a3e1d6',
        caregiverId: 'f7a00df5-bbc4-4ad7-9918-c07e16e709f6',
        payloadAsText: '{"id": "5b044315-01a5-4879-9059-523733fdb33c", "visit_id": "5cd753f0-8b66-f8a8-43f7-330f62a3e1d6", "timestamp": "2019-05-12T19:30:01+01:00", "event_type": "regular_medication_taken", "caregiver_id": "f7a00df5-bbc4-4ad7-9918-c07e16e709f6", "medication_type": "SCHEDULED", "task_instance_id": "bXw3YmU3M2M3NC0zYzZkLTQ2ZjQtYWViMC01YzJmNTczMThiYWF8MjAxOS0wNS0xMlQxOTowMDowMC4wMDBa", "care_recipient_id": "df50cac5-293c-490d-a06c-ee26796f850d"}',
        rejectedEventId: null,
        observationEventId: null,
        timestamp: '2019-05-12T19:30:01+01:00',
        eventType: 'regular_medication_taken',
        careRecipientId: 'df50cac5-293c-490d-a06c-ee26796f850d',
    },
];
