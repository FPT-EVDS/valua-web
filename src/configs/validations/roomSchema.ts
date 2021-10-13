import ValidationMessage from 'enums/validationMessage';
import { number, object, string } from 'yup';

const roomSchema = object({
  roomName: string()
    .defined('Name is required')
    .max(255, `${ValidationMessage.MAX_LENGTH} 255`),
  description: string().max(255, `${ValidationMessage.MAX_LENGTH} 255`),
  floor: number().defined('Floor is required').min(0, 'Minimum floor is 0'),
  seatCount: number()
    .defined('Seat count is required')
    .positive('Seat count must be a positive number'),
});

export default roomSchema;
