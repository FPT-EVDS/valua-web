import Semester from 'models/semester.model';

export default interface SubjectExamineesDashboardDto {
  currentSemester: Pick<Semester, 'semesterId' | 'semesterName'>;
  total: number;
  assigned: number;
  unassigned: number;
  exempted: number;
}
