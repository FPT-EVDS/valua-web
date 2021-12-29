import { object, string } from 'yup';

const toolSchema = object({
  toolName: string()
    .defined('Name is required')
    .max(50, 'Maximum length of tool name field is 3 - 50 characters'),
  toolCode: string()
    .defined('Tool code is required')
    .min(3, 'Tool code must have length of 3 - 50 characters')
    .max(50, 'Tool code must have length of 3 - 50 characters'),
});

export default toolSchema;