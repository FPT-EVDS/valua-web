import { object, string } from 'yup';

const toolSchema = object({
  toolName: string()
    .required('Name is required')
    .min(1, 'Length of tool name field is 1 - 30 characters')
    .max(30, 'Length of tool name field is 1 - 30 characters')
    .trim('Name is required'),
  toolCode: string()
    .required('Tool code is required')
    .min(1, 'Tool code must have length of 1 - 10 characters')
    .max(10, 'Tool code must have length of 1 - 10 characters')
    .trim('Tool code is required'),
});

export default toolSchema;
