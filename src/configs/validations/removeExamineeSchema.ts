import { object, string } from 'yup';

const removeExamineeSchema = object({
  removedReason: string()
    .defined()
    .max(50, max => `Removed reason max length is ${max.max}`)
    .min(8, min => `Removed reason max length is ${min.min}`)
    .strict()
    .trim('Removed reason is required'),
});

export default removeExamineeSchema;
