import ExamRoomStatus from 'enums/examRoomStatus.enum';

import ExamRoom from './examRoom.model';
import ExamSeat from './examSeat.model';
import Shift from './shift.model';

export default interface DetailExamRoom extends ExamRoom {
  shift: Pick<Shift, 'shiftId' | 'beginTime' | 'finishTime'>;
  examSeats: ExamSeat[];
  status: ExamRoomStatus;
  createdDate: Date;
  lastModifiedDate: Date;
}
