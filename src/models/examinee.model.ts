import ExamineeStatus from 'enums/examineeStatus.enum';

import Account from './account.model';

export default interface Examinee {
  subjectExamineeId: string;
  examinee: Pick<
    Account,
    | 'appUserId'
    | 'companyId'
    | 'email'
    | 'fullName'
    | 'imageUrl'
    | 'phoneNumber'
  >;
  removedReason: string | null;
  status: ExamineeStatus;
}
