import Account from './account.model';

export default interface Attendance {
  attendanceId: string;
  examinee: Pick<
    Account,
    | 'appUserId'
    | 'email'
    | 'fullName'
    | 'phoneNumber'
    | 'imageUrl'
    | 'companyId'
  >;
  position: number;
}
