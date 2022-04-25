import { object, string } from 'yup';

const addExamRoomSchema = object({
  subjectSemesterId: string().required('An available subject is required'),
});

export default addExamRoomSchema;
