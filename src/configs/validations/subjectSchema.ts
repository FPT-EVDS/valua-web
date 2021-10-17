import ValidationMessage from 'enums/validationMessage';
import { object, string } from 'yup';

const subjectSchema = object({
  subjectName: string()
    .defined('Subject name is required')
    .max(255, value => `${ValidationMessage.MAX_LENGTH} ${value.max}`),
  subjectCode: string()
    .defined('Subject code is required')
    .max(255, value => `${ValidationMessage.MAX_LENGTH} ${value.max}`),
});

export default subjectSchema;
