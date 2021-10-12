import ValidationMessage from 'enums/validationMessage';
import { date, object, string } from 'yup';

const cameraSchema = object({
  cameraName: string()
    .defined('Name is required')
    .max(255, `${ValidationMessage.MAX_LENGTH} 255`),
  purchaseDate: date().typeError('Invalid date').defined('Date is required'),
  configurationUrl: string().defined('Configuration URL is required'),
  description: string().max(255, `${ValidationMessage.MAX_LENGTH} 255`),
});

export default cameraSchema;
