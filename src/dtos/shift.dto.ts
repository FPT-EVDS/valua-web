import Semester from 'models/semester.model';

export default interface ShiftDto {
  shiftId: string | null;
  semester: Semester | null;
  beginTime: Date;
  finishTime: Date;
  description: string;
}
