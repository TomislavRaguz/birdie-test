import * as express from 'express';
import { wrapAsync } from '../../lib';
import eventsService from './events.service';

const eventController = express.Router();
//http://localhost:8080/api/v1/events?careRecipientId=df50cac5-293c-490d-a06c-ee26796f850d&limit=10&eventType=task_completed&eventType=task_schedule_created
eventController.get(
  '/v1/events',
  wrapAsync(async (req, res) => {
    const user = req.getUser();
    const events = await eventsService.exposeCollection(user, req.query);
    res.json(events);
  })
);

eventController.get(
  '/v1/events/aggregate',
  wrapAsync(async (req, res) => {
    const user = req.getUser();
    const eventAggregates = await eventsService.exposeAggregates(
      user,
      req.query
    );
    res.json(eventAggregates);
  })
);

export default eventController;
