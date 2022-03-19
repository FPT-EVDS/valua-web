import ValidationMessage from 'enums/validationMessage';
import { number, object, string } from 'yup';

const roomSchema = object({
  roomName: string()
    .defined('Name is required')
    .max(255, value => `${ValidationMessage.MAX_LENGTH} ${value.max}`),
  description: string().max(
    255,
    value => `${ValidationMessage.MAX_LENGTH} ${value.max}`,
  ),
  floor: number()
    .typeError('Floor is required')
    .defined('Floor is required')
    .min(0, value => `Minimum floor is ${value.min}`),
  seatCount: number()
    .defined('Seat count is required')
    .positive('Seat count must be a positive number'),
});

export default roomSchema;
