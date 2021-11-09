import { number, object, string } from 'yup';

const addExamRoomSchema = object({
  subjectId: string().defined('A subject must be selected'),
  numOfRooms: number()
    .defined('Number of rooms must be defined')
    .min(1, min => `Minimum amount of rooms for this subject is ${min.min}`),
});

export default addExamRoomSchema;
