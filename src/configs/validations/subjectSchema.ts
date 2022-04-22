import { number, object, string } from 'yup';

const subjectSchema = object({
  subjectName: string()
    .defined('Name is required')
    .max(50, 'Maximum length of subject name field is 3 - 50 characters')
    .strict()
    .trim('Subject name is required'),
  subjectCode: string()
    .defined('Subject code is required')
    .min(3, 'Subject code must have length of 3 - 50 characters')
    .max(50, 'Subject code must have length of 3 - 50 characters')
    .strict()
    .trim('Subject code is required'),
  duration: number()
    .defined('Duration is required')
    .min(10, 'Min duration is 10 minutes')
    .max(270, 'Max duration is 4h30 hours'),
});

export default subjectSchema;
