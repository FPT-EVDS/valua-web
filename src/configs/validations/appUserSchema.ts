import ValidationMessage from 'enums/validationMessage';
import { date, object, string, number } from 'yup';

const appUserSchema = object({
  fullName: string()
    .defined('Fullname is required')
    .max(255, `${ValidationMessage.MAX_LENGTH} 255`),
  // gender: number().integer().defined('Gender is required').oneOf([0, 1]),
  birthdate: date().typeError('Invalid date').defined('Date is required'),
  address: string()
    .defined('Address is required')
    .max(150, `${ValidationMessage.MAX_LENGTH} 150`),
  email: string()
    .defined('Email is required')
    .email('Invalid email format')
    .max(50, `${ValidationMessage.MAX_LENGTH} 50`),
  phoneNumber: string()
    .defined('Phone number is required')
    .length(10, ValidationMessage.PHONE_LENGTH),
  gender: number().integer().defined('Gender is required').oneOf([0, 1]),
});

export default appUserSchema;
