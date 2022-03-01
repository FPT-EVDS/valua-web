import Account from 'models/account.model';
import ExamRoom from 'models/examRoom.model';

export default interface AddAttendanceDto {
  examRoom: Pick<ExamRoom, 'examRoomId'>;
  examinee: Pick<Account, 'appUserId'>;
}
