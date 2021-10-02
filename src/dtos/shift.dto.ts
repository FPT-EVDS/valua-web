import Account from 'models/account.model';
import Room from 'models/room.model';
import Semester from 'models/semester.model';
import Subject from 'models/subject.model';

export default interface ShiftDto {
  shiftId: string | null;
  staff: Account | null;
  examRoom: Room | null;
  semester: Semester | null;
  subject: Subject | null;
  beginTime: Date;
  finishTime: Date;
  description: string;
}
