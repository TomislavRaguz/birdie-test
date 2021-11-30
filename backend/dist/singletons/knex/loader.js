"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbLoader = void 0;
const _1 = require(".");
async function dbLoader() {
    await _1.db.raw('SELECT 1');
    return () => {
        return _1.db.destroy();
    };
}
exports.dbLoader = dbLoader;
