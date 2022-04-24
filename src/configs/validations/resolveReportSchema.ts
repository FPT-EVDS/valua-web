import { object, string } from 'yup';

const resolveReportSchema = object({
  solution: string()
    .required('Solution is required')
    .trim('Solution is required'),
});

export default resolveReportSchema;
