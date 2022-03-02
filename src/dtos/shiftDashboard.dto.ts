import Semester from 'models/semester.model';

import DashboardShift from './dashboardShift.dto';

export default interface ShiftDashboardDto {
  currentSemester: Pick<Semester, 'semesterId' | 'semesterName'>;
  week: string;
  totalShiftsInWeek: number;
  shifts: DashboardShift[] | null;
  message: string;
  totalShifts: number;
}
