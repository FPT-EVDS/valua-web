import { differenceInMinutes } from 'date-fns';
import { date, DateSchema, object, ref, string } from 'yup';

const shiftSchema = object({
  beginTime: date()
    .typeError('Invalid time')
    .required('Begin time is required')
    .min(new Date(), 'Begin time must larger than current time'),
  finishTime: date()
    .typeError('Invalid time')
    .required('Finish time is required')
    .min(ref('beginTime'), "Finish time can't be before begin time")
    .when(
      'beginTime',
      (beginTime: Date, yup: DateSchema) =>
        beginTime &&
        yup.test(
          'finishTime',
          'Max time range is 8 hours',
          value =>
            differenceInMinutes(beginTime, new Date(String(value))) >=
            -(60 * 8),
        ),
    ),
  semester: object()
    .shape({
      semesterId: string(),
    })
    .nullable()
    .required('Semester is required'),
});

export default shiftSchema;
