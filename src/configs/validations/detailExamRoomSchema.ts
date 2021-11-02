import { object, string } from 'yup';

const detailExamRoomSchema = object({
  room: object().shape({
    roomId: string().defined('Room is required'),
  }),
  staff: object().shape({
    appUserId: string().defined('Staff is required'),
  }),
  subject: object().shape({
    subjectId: string().defined('Subject is required'),
  }),
});

export default detailExamRoomSchema;
