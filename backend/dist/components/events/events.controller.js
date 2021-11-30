"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const lib_1 = require("../../lib");
const events_service_1 = require("./events.service");
const eventController = express.Router();
eventController.get('/v1/events', (0, lib_1.wrapAsync)(async (req, res) => {
    const user = req.getUser();
    const events = await events_service_1.default.exposeCollection(user, req.query);
    res.json(events);
}));
eventController.get('/v1/events/aggregate', (0, lib_1.wrapAsync)(async (req, res) => {
    const user = req.getUser();
    const eventAggregates = await events_service_1.default.exposeAggregates(user, req.query);
    res.json(eventAggregates);
}));
exports.default = eventController;
