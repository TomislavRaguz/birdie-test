"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exposeEventCollection_1 = require("./exposeEventCollection");
const exposeAggregates_1 = require("./exposeAggregates");
exports.default = {
    exposeCollection: exposeEventCollection_1.exposeCollection,
    exposeAggregates: exposeAggregates_1.exposeAggregates,
};
