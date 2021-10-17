import ValidationMessage from 'enums/validationMessage';
import { date, object, string } from 'yup';

const cameraSchema = object({
  cameraName: string()
    .defined('Name is required')
    .max(255, value => `${ValidationMessage.MAX_LENGTH} ${value.max}`),
  purchaseDate: date().typeError('Invalid date').defined('Date is required'),
  configurationUrl: string().defined('Configuration URL is required'),
  description: string().max(
    255,
    value => `${ValidationMessage.MAX_LENGTH} ${value.max}`,
  ),
});

export default cameraSchema;
