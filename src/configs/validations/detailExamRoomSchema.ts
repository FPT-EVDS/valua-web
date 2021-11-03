import { object } from 'yup';

const detailExamRoomSchema = object({
  room: object().nullable().required('Room is required'),
  staff: object().nullable().required('Staff is required'),
  subject: object().nullable().required('Subject is required'),
});

export default detailExamRoomSchema;
