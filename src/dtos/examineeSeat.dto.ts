import Account from 'models/account.model';

export default interface ExamineeSeat {
  examinee: Pick<Account, 'appUserId'>;
  position: number;
}
