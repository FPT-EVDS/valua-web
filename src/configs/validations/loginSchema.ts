import { object, string } from 'yup';

const loginSchema = object({
  email: string().required('Email is required').email('Invalid email format'),
  password: string().required('Password is required'),
});

export default loginSchema;
