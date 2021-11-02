import Account from 'models/account.model';
import ExamRoom from 'models/examRoom.model';

export default interface DetailExamSeat {
  examRoom: Pick<ExamRoom, 'examRoomID'>;
  examinee: Pick<Account, 'appUserId'>;
}
