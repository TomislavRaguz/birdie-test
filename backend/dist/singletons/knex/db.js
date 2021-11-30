"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const knex_1 = require("knex");
const enviroment_1 = require("../../enviroment");
const knexfile_1 = require("./knexfile");
const knexConfig = knexfile_1.default[enviroment_1.env.NODE_ENV];
exports.db = (0, knex_1.default)(knexConfig);
