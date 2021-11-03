import Account from 'models/account.model';
import ExamRoom from 'models/examRoom.model';

export default interface DetailExamSeat {
  examSeatId?: string;
  examRoom: Pick<ExamRoom, 'examRoomID'>;
  examinee: Pick<Account, 'appUserId'>;
}
