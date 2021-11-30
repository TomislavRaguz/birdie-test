import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import { RESTError } from './RESTError';
const ajv = new Ajv({ coerceTypes: 'array' });
addFormats(ajv);

export function createAssert<T>(schema: JSONSchemaType<T>) {
  const validate = ajv.compile<T>(schema);
  return function (input: any) {
    if (validate(input)) {
      return input;
    } else {
      throw new RESTError({
        code: 'VALIDATION_ERROR',
        HTTPStatusCode: 400,
        devMessage: validate.errors,
      });
    }
  };
}
