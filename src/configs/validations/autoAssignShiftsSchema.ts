import { array, date, number, object } from 'yup';

const autoAssignShiftsSchema = object({
  semester: object().defined('Semester is required'),
  fromDate: date(),
  durationInDays: number(),
  subjectSemesters: array()
    .defined('A subject must be seleted')
    .min(1, 'A subject must be seleted'),
});

export default autoAssignShiftsSchema;
