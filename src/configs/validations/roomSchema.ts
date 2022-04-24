import ValidationMessage from 'enums/validationMessage';
import { number, object, string } from 'yup';

const roomSchema = object({
  roomName: string()
    .required('Name is required')
    .max(255, value => `${ValidationMessage.MAX_LENGTH} ${value.max}`)
    .trim('Name is required'),
  description: string()
    .max(255, value => `${ValidationMessage.MAX_LENGTH} ${value.max}`)
    .trim('Description is required'),
  floor: number()
    .typeError('Floor is required')
    .required('Floor is required')
    .min(0, value => `Minimum floor is ${value.min}`),
  seatCount: number()
    .required('Seat count is required')
    .positive('Seat count must be a positive number'),
});

export default roomSchema;
