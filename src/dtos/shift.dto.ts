import Semester from 'models/semester.model';

export default interface ShiftDto {
  shiftId: string | null;
  semester: Pick<Semester, 'semesterId' | 'semesterName'> | null;
  beginTime: Date;
  finishTime: Date;
  description: string;
}
