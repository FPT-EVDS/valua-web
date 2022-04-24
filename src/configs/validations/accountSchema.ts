import { differenceInYears } from 'date-fns';
import ValidationMessage from 'enums/validationMessage';
import Role from 'models/role.model';
import { date, number, object, string } from 'yup';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\(\d{2,3}\\)[ \\-]*)|(\d{2,4})[ \\-]*)*?\d{3,4}?[ \\-]*\d{3,4}?$/;

const accountSchema = object({
  address: string()
    .required('Address is required')
    .max(
      150,
      value => `Maximum length of address field is ${value.max} characters`,
    )
    .trim('Address is required'),
  birthdate: date()
    .typeError('Invalid date')
    .required('Please pick a date')
    .test(
      'birthdate',
      'Age must be greater than or equal to 7 years old',
      birthdate =>
        differenceInYears(new Date(), new Date(String(birthdate))) >= 7,
    ),
  email: string()
    .required('Email is required')
    .email('Please enter a valid email'),
  fullName: string()
    .required('Full name is required')
    .matches(
      /[ A-Za-z]{3,50}/,
      'Full name must be letter only with length of 3 - 50 characters',
    )
    .max(50, 'Max length is 50')
    .trim('Full name is required'),
  gender: number().integer().required('Gender is required').oneOf([0, 1]),
  phoneNumber: string()
    .required('Phone number is required')
    .matches(phoneRegExp, 'Phone number is not valid')
    .length(10, ValidationMessage.PHONE_LENGTH),
  userRole: object().shape({
    roleID: number(),
    roleName: string(),
  }),
  classCode: string().when('userRole', {
    is: (value: Role) => value.roleID === 3,
    then: string()
      .required('Class is required')
      .max(
        10,
        value => `Maximum length of class field is ${value.max} characters`,
      )
      .trim('Class is required'),
    otherwise: string().nullable().notRequired(),
  }),
  companyId: string().when('userRole', {
    is: (value: Role) => value.roleID === 3,
    then: string()
      .required('StudentID is required')
      .max(
        10,
        value =>
          `Maximum length of student id field is ${value.max} characters`,
      )
      .trim('StudentID is required'),
    otherwise: string()
      .required('CompanyID is required')
      .max(
        10,
        value =>
          `Maximum length of company id field is ${value.max} characters`,
      )
      .trim('CompanyID is required'),
  }),
});

export default accountSchema;
