import Semester from 'models/semester.model';
import Shift from 'models/shift.model';

export default interface ShiftDashboardDto {
  currentSemester: Pick<Semester, 'semesterId' | 'semesterName'>;
  week: string;
  totalShiftsInWeek: number;
  shifts: Array<Pick<Shift, 'shiftId' | 'beginTime' | 'finishTime' | 'status'>>;
  message: string;
  totalShifts: number;
}
