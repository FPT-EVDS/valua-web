import { array, date, number, object } from 'yup';

const autoAssignShiftsSchema = object({
  semester: object().required('Semester is required'),
  fromDate: date(),
  durationInDays: number(),
  subjectSemesters: array()
    .required('A subject must be seleted')
    .min(1, 'A subject must be seleted'),
});

export default autoAssignShiftsSchema;
