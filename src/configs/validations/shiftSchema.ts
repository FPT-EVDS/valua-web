import { differenceInMinutes } from 'date-fns';
import ValidationMessage from 'enums/validationMessage';
import { date, DateSchema, object, ref, string } from 'yup';

const shiftSchema = object({
  description: string()
    .defined('Description is required')
    .min(6, value => `${ValidationMessage.MIN_LENGTH} ${value.min}`)
    .max(200, value => `${ValidationMessage.MAX_LENGTH} ${value.max}`),
  beginTime: date()
    .typeError('Invalid time')
    .defined('Begin time is required')
    .min(new Date(), 'Begin time must larger than current time'),
  finishTime: date()
    .typeError('Invalid time')
    .defined('Finish time is required')
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
