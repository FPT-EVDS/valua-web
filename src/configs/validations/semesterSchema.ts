import ValidationMessage from 'enums/validationMessage';
import { date, object, ref, string } from 'yup';

const semesterSchema = object({
  semesterName: string()
    .defined('Semester name is required')
    .max(255, `${ValidationMessage.MAX_LENGTH} 255`),
  beginDate: date().typeError('Invalid date').defined('Date is required'),
  endDate: date()
    .typeError('Invalid date')
    .defined('Date is required')
    .min(ref('beginDate'), "End date can't be before start date"),
});

export default semesterSchema;
