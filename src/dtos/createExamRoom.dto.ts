import Room from 'models/room.model';
import Shift from 'models/shift.model';
import SubjectSemester from 'models/subjectSemester.model';

import Attendance from './attendance.dto';

export default interface CreateExamRoomDto {
  shift: Pick<Shift, 'shiftId'>;
  attendances: Array<Attendance>;
  room: Pick<Room, 'roomId'>;
  subjectSemester: Pick<SubjectSemester, 'subjectSemesterId'>;
}
