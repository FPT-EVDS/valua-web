import ExamineeStatus from 'enums/examineeStatus.enum';

import Account from './account.model';

export default interface SubjectExaminee {
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
  removedReason: string | null;
  status: ExamineeStatus;
}
