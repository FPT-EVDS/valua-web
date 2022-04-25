import { differenceInHours } from 'date-fns';
import { array, date, number, object } from 'yup';

const autoAssignShiftsSchema = object({
  semester: object().required('Semester is required'),
  fromDate: date().test(
    'fromDate',
    'From date must be at least 24 hours after now',
    fromDate => differenceInHours(new Date(String(fromDate)), new Date()) >= 24,
  ),
  durationInDays: number(),
  subjectSemesters: array()
    .required('A subject must be seleted')
    .min(1, 'A subject must be seleted'),
});

export default autoAssignShiftsSchema;
