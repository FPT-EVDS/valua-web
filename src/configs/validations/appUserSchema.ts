import ValidationMessage from 'enums/validationMessage';
import { date, number, object, string } from 'yup';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\(\d{2,3}\\)[ \\-]*)|(\d{2,4})[ \\-]*)*?\d{3,4}?[ \\-]*\d{3,4}?$/;

const appUserSchema = object({
  fullName: string()
    .defined('Full name is required')
    .max(255, `${ValidationMessage.MAX_LENGTH} 255`)
    .strict()
    .trim('Full name is required'),
  // gender: number().integer().defined('Gender is required').oneOf([0, 1]),
  birthdate: date().typeError('Invalid date').defined('Date is required'),
  address: string()
    .defined('Address is required')
    .max(150, `${ValidationMessage.MAX_LENGTH} 150`)
    .strict()
    .trim('Address is required'),
  email: string()
    .defined('Email is required')
    .email('Invalid email format')
    .max(50, `${ValidationMessage.MAX_LENGTH} 50`),
  phoneNumber: string()
    .defined('Phone number is required')
    .matches(phoneRegExp, 'Phone number is not valid')
    .length(10, ValidationMessage.PHONE_LENGTH)
    .strict()
    .trim('Phone number is required'),
  gender: number().integer().defined('Gender is required').oneOf([0, 1]),
});

export default appUserSchema;
