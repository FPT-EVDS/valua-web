import ExamineeStatus from 'enums/examineeStatus.enum';

import Account from './account.model';

export default interface SubjectExaminee {
  subjectExamineeID: string;
  examinee: Pick<
    Account,
    | 'appUserId'
    | 'email'
    | 'fullName'
    | 'phoneNumber'
    | 'imageUrl'
    | 'companyId'
  >;
  status: ExamineeStatus;
}
