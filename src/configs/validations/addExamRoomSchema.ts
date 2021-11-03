import { number, object, string } from 'yup';

const addExamRoomSchema = object({
  subjectId: string().defined('A subject must be selected'),
  numOfRooms: number()
    .defined('Number of rooms must be defined')
    .min(1, 'Min rooms is 1'),
});

export default addExamRoomSchema;
