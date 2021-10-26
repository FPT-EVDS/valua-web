import ShiftStatus from 'enums/shiftStatus.enum';

import Account from './account.model';
import Semester from './semester.model';

export default interface Shift {
  shiftId: string | null;
  shiftManager: Pick<
    Account,
    | 'appUserId'
    | 'email'
    | 'fullName'
    | 'phoneNumber'
    | 'imageUrl'
    | 'companyId'
  >;
  semester: Pick<Semester, 'semesterId' | 'semesterName'>;
  beginTime: Date;
  finishTime: Date;
  status: ShiftStatus;
  createdDate: Date;
  lastModifiedDate: Date;
}
