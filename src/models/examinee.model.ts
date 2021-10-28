import ExamineeStatus from 'enums/examineeStatus.enum';

import Account from './account.model';

export default interface Examinee {
  subjectExamineeID: string;
  examinee: Pick<
    Account,
    | 'appUserId'
    | 'companyId'
    | 'email'
    | 'fullName'
    | 'imageUrl'
    | 'phoneNumber'
  >;
  removeReason: string | null;
  status: ExamineeStatus;
}
