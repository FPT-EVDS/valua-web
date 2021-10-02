import Account from './account.model';
import Room from './room.model';
import Semester from './semester.model';
import Subject from './subject.model';

export default interface Shift {
  shiftId: string;
  shiftManager: Account;
  staff: Account;
  // FIXME: add exam seat type
  examSeats: any[];
  examRoom: Room;
  semester: Semester;
  subject: Subject;
  beginTime: Date;
  finishTime: Date;
  description: string;
  isActive: boolean;
  createdDate: Date;
  lastModifiedDate: Date;
}
