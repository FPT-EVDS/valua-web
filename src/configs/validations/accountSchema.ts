import ValidationMessage from 'enums/validationMessage';
import Role from 'models/role.model';
import { date, number, object, string } from 'yup';

const accountSchema = object({
  address: string()
    .defined('Address is required')
    .max(150, `${ValidationMessage.MAX_LENGTH} 150`),
  birthdate: date().typeError('Invalid date').defined('Date is required'),
  email: string()
    .defined('Email is required')
    .email('Invalid email format')
    .max(50, `${ValidationMessage.MAX_LENGTH} 50`),
  fullName: string()
    .defined('Fullname is required')
    .max(255,value => `${ValidationMessage.MAX_LENGTH} ${value.max}`),
  gender: number().integer().defined('Gender is required').oneOf([0, 1]),
  phoneNumber: string()
    .defined('Phone number is required')
    .length(10, ValidationMessage.PHONE_LENGTH),
  imageUrl: string().url().nullable(),
  userRole: object().shape({
    roleID: number(),
    roleName: string(),
  }),
  classCode: string().when('userRole', {
    is: (value: Role) => value.roleID === 3,
    then: string()
      .required('Classcode is required')
      .max(10, `${ValidationMessage.MAX_LENGTH} 10`),
    otherwise: string().notRequired(),
  }),
  companyId: string()
    .max(10, `${ValidationMessage.MAX_LENGTH} 10`)
    .when('userRole', {
      is: (value: Role) => value.roleID === 3,
      then: string().required('StudentID is required'),
      otherwise: string().required('CompanyID is required'),
    }),
});

export default accountSchema;
