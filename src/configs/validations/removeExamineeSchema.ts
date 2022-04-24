import { object, string } from 'yup';

const removeExamineeSchema = object({
  removedReason: string()
    .required('Removed reason is required')
    .max(50, max => `Removed reason max length is ${max.max}`)
    .min(8, min => `Removed reason min length is ${min.min}`)
    .trim('Removed reason is required'),
});

export default removeExamineeSchema;
