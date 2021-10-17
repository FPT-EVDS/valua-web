import { array, object } from 'yup';

const addSubjectsSchema = object({
  subjects: array().min(
    1,
    value => `At least ${value.min} subject must be selected`,
  ),
});

export default addSubjectsSchema;
