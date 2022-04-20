import Semester from 'models/semester.model';

export default interface SubjectExamineesDashboardDto {
  currentSemester: Pick<Semester, 'semesterId' | 'semesterName'>;
  totalExaminees: number;
  totalAssignments: number;
  totalStaffs: number;
  assigned: number;
  unassigned: number;
  totalTeachers: number;
  totalSeats: number;
  exempted: number;
  totalRooms: number;
}
