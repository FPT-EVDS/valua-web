import Semester from 'models/semester.model';

import ReportOfWeek from './reportOfWeek.dto';

export default interface ReportDashboardDto {
  currentSemester: Pick<Semester, 'semesterId' | 'semesterName'>;
  reportsOfWeek: Array<ReportOfWeek> | null;
  totalUnresolved: number;
  totalReports: number;
}
