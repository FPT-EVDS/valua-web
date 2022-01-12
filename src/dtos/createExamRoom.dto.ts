import Room from 'models/room.model';
import Shift from 'models/shift.model';
import Subject from 'models/subject.model';

import Attendance from './attendance.dto';

export default interface CreateExamRoomDto {
  shift: Pick<Shift, 'shiftId'>;
  attendances: Attendance[];
  room: Pick<Room, 'roomId'>;
  subject: Pick<Subject, 'subjectId'>;
}
