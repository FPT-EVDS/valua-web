import { object, string } from 'yup';

const addExamRoomSchema = object({
  subjectSemesterId: string().defined('An available subject is required'),
});

export default addExamRoomSchema;
