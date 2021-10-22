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
  isAssigned: boolean;
}
