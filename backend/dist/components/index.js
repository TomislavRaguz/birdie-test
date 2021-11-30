"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiController = void 0;
const express = require("express");
const lib_1 = require("../lib");
const events_controller_1 = require("./events/events.controller");
exports.apiController = express.Router();
exports.apiController.use(events_controller_1.default);
exports.apiController.use(() => {
    throw new lib_1.RESTError({
        HTTPStatusCode: 404,
        code: "API ROUTE 404"
    });
});
