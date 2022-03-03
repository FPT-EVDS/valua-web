import { object, ref, string } from 'yup';

const changePasswordSchema = object({
  currentPassword: string().required('Current password is required'),
  newPassword: string().required('New password is required'),
  confirmPassword: string().oneOf(
    [ref('newPassword')],
    "Confirm password doesn't match new password",
  ),
});

export default changePasswordSchema;
