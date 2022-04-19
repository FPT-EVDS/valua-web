import { object, string } from 'yup';

const resolveReportSchema = object({
  solution: string()
    .defined('Solution is required')
    .strict()
    .trim('Solution is required'),
});

export default resolveReportSchema;
