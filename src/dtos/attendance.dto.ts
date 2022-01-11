import Account from 'models/account.model';

export default interface Attendance {
  examinee: Pick<Account, 'appUserId'>;
  position: number;
}
