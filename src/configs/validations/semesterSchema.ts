import ValidationMessage from 'enums/validationMessage';
import { date, object, ref, string } from 'yup';

const semesterSchema = object({
  semesterName: string()
    .required('Semester name is required')
    .max(255, value => `${ValidationMessage.MAX_LENGTH} ${value.max}`)
    .trim('Semester name is required'),
  beginDate: date()
    .typeError('Invalid date')
    .required('Begin date is required')
    .min(new Date(), 'Begin date must larger than current date'),
  endDate: date()
    .typeError('Invalid date')
    .required('Date is required')
    .min(ref('beginDate'), "End date can't be before start date"),
});

export default semesterSchema;
