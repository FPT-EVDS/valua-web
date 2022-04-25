import ValidationMessage from 'enums/validationMessage';
import { date, number, object, string } from 'yup';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\(\d{2,3}\\)[ \\-]*)|(\d{2,4})[ \\-]*)*?\d{3,4}?[ \\-]*\d{3,4}?$/;

const appUserSchema = object({
  fullName: string()
    .required('Full name is required')
    .max(255, `${ValidationMessage.MAX_LENGTH} 255`)
    .trim('Full name is required'),
  birthdate: date().typeError('Invalid date').required('Date is required'),
  address: string()
    .required('Address is required')
    .max(150, `${ValidationMessage.MAX_LENGTH} 150`)
    .trim('Address is required'),
  email: string()
    .required('Email is required')
    .email('Invalid email format')
    .max(50, `${ValidationMessage.MAX_LENGTH} 50`),
  phoneNumber: string()
    .required('Phone number is required')
    .matches(phoneRegExp, 'Phone number is not valid')
    .length(10, ValidationMessage.PHONE_LENGTH)
    .trim('Phone number is required'),
  gender: number().integer().required('Gender is required').oneOf([0, 1]),
});

export default appUserSchema;
