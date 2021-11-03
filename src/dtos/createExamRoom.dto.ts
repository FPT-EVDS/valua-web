import Room from 'models/room.model';
import Shift from 'models/shift.model';
import Subject from 'models/subject.model';

import ExamineeSeat from './examineeSeat.dto';

export default interface CreateExamRoomDto {
  shift: Pick<Shift, 'shiftId'>;
  examSeats: ExamineeSeat[];
  room: Pick<Room, 'roomId'>;
  subject: Pick<Subject, 'subjectId'>;
}
