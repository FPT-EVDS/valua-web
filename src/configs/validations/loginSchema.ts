import { object, string } from 'yup';

const loginSchema = object({
  email: string().defined('Email is required').email('Invalid email format'),
  password: string().defined('Password is required'),
});

export default loginSchema;
