import Status from 'enums/status.enum';

import Account from './account.model';
import Semester from './semester.model';

export default interface Shift {
  shiftId: string | null;
  shiftManager: Account;
  semester: Semester;
  beginTime: Date;
  finishTime: Date;
  description: string;
  status: Status;
  createdDate: Date;
  lastModifiedDate: Date;
}
