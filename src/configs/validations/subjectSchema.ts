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
  numberOfExam: number()
    .defined('Number of exam is required')
    .min(1, 'Number of exam must be between 1 - 3')
    .max(3, 'Number of exam must be between 1 - 3'),
});

export default subjectSchema;
