import ValidationMessage from 'enums/validationMessage';
import { date, object, string } from 'yup';

const cameraSchema = object({
  cameraName: string()
    .defined('Name must have length of 3 - 50 characters')
    .max(50, value => `${ValidationMessage.MAX_LENGTH} ${value.max}`),
  purchaseDate: date()
    .typeError('Invalid date')
    .defined('Date is required')
    .max(new Date(), 'Purchase date must be less than or equal to today'),
  configurationUrl: string().defined('Configuration URL is required'),
  description: string().max(
    255,
    value => `${ValidationMessage.MAX_LENGTH} ${value.max}`,
  ),
});

export default cameraSchema;
