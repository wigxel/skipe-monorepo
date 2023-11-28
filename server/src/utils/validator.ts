import { validationError } from './errors';
import { returnResult } from './respond';
import { ObjectSchema } from 'yup';

const validator = (schema: ObjectSchema<any>) => (payload: any) =>
  schema
    .validate(payload)
    .then(res => returnResult(true, res))
    .catch(error => validationError(error));

export default validator;
