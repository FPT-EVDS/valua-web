import Account from './account.model';

export default interface ExamSeat {
  examSeatId: string;
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
