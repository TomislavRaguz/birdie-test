"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAssert = void 0;
const ajv_1 = require("ajv");
const ajv_formats_1 = require("ajv-formats");
const RESTError_1 = require("./RESTError");
const ajv = new ajv_1.default({ coerceTypes: 'array' });
(0, ajv_formats_1.default)(ajv);
function createAssert(schema) {
    const validate = ajv.compile(schema);
    return function (input) {
        if (validate(input)) {
            return input;
        }
        else {
            throw new RESTError_1.RESTError({
                code: 'VALIDATION_ERROR',
                HTTPStatusCode: 400,
                devMessage: validate.errors,
            });
        }
    };
}
exports.createAssert = createAssert;
