import ExamRoomStatus from 'enums/examRoomStatus.enum';

import Attendance from './attendance.model';
import ExamRoom from './examRoom.model';
import Shift from './shift.model';

export default interface DetailExamRoom extends ExamRoom {
  shift: Pick<Shift, 'shiftId' | 'beginTime' | 'finishTime'>;
  attendances: Attendance[];
  status: ExamRoomStatus;
  createdDate: Date;
  lastModifiedDate: Date;
}
