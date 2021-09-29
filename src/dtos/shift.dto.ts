import Room from 'models/room.model';
import Semester from 'models/semester.model';
import Subject from 'models/subject.model';

export default interface ShiftDto {
  shiftId: string | null;
  staff: Account;
  examRoom: Room;
  semester: Semester;
  subject: Subject;
  beginTime: Date;
  finishTime: Date;
  description: string;
}
