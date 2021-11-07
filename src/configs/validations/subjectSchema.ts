import { object, string } from 'yup';

const subjectSchema = object({
  subjectName: string()
    .defined('Name is required')
    .max(50, 'Maximum length of subject name field is 3 - 50 characters'),
  subjectCode: string()
    .defined('Subject code is required')
    .min(3, 'Subject code must have length of 3 - 50 characters')
    .max(50, 'Subject code must have length of 3 - 50 characters'),
});

export default subjectSchema;
