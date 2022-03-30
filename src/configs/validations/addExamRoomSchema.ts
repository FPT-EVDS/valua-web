import { object, string } from 'yup';

const addExamRoomSchema = object({
  subjectSemesterId: string().defined('A subject must be selected'),
});

export default addExamRoomSchema;
