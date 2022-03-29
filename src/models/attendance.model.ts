import Account from './account.model';

export default interface Attendance {
  attendanceId: string;
  subjectExaminee: {
    subjectExamineeId: string;
    examinee: Pick<
      Account,
      | 'appUserId'
      | 'email'
      | 'fullName'
      | 'phoneNumber'
      | 'imageUrl'
      | 'companyId'
    >;
    status: number;
    removedReason: string | null;
  };
  position: number;
}
