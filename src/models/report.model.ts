import ReportType from 'enums/reportType.enum';

import Account from './account.model';
import ExamRoom from './examRoom.model';

export default interface Report {
  reportId: string;
  reporter: Pick<
    Account,
    | 'appUserId'
    | 'email'
    | 'fullName'
    | 'phoneNumber'
    | 'imageUrl'
    | 'companyId'
  >;
  reportedUser: Pick<
    Account,
    | 'appUserId'
    | 'email'
    | 'fullName'
    | 'phoneNumber'
    | 'imageUrl'
    | 'companyId'
  >;
  examRoom: ExamRoom;
  solution?: string;
  reportType: ReportType;
  description?: string;
  note?: string;
  imageUrl?: string;
  isResolved?: boolean;
  createdDate: Date;
  lastModifiedDate: Date;
}
