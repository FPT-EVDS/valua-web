import Report from 'models/report.model';
import Semester from 'models/semester.model';

export default interface ReportDashboardDto {
  currentSemester: Pick<Semester, 'semesterId' | 'semesterName'>;
  // FIXME: backend not correctly return
  reportsOfWeek: Array<Report>;
  totalUnresolved: number;
  totalReports: number;
}
