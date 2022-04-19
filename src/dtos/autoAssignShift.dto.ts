import Semester from 'models/semester.model';
import SubjectSemester from 'models/subjectSemester.model';

export default interface AutoAssignShiftDto {
  semester: Pick<Semester, 'semesterId'> | null;
  fromDate: string;
  durationInDays: string;
  subjectSemesters: Array<Pick<SubjectSemester, 'subjectSemesterId'>>;
}
