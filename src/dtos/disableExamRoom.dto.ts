import ExamRoomStatus from 'enums/examRoomStatus.enum';

export default interface DisableExamRoom {
  examRoomId: string;
  examRoomname: string;
  status: ExamRoomStatus;
}
