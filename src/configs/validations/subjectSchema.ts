import ValidationMessage from 'enums/validationMessage';
import { object, string } from 'yup';

const subjectSchema = object({
  subjectName: string()
    .defined('Subject name is required')
    .max(255, `${ValidationMessage.MAX_LENGTH} 255`),
  subjectCode: string()
    .defined('Subject code is required')
    .max(255, `${ValidationMessage.MAX_LENGTH} 255`),
});

export default subjectSchema;
