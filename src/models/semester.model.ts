import SubjectSemester from './subjectSemester.model';

export default interface Semester {
  semesterId: string;
  semesterName: string;
  numOfSubjects: number;
  subjectSemesters: SubjectSemester[];
  beginDate: Date;
  endDate: Date;
  isActive: boolean;
  createdDate: Date;
  lastModifiedDate: Date;
}
