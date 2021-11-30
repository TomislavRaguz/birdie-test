"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapAsync = void 0;
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
}
exports.wrapAsync = wrapAsync;
