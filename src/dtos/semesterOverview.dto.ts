import Semester from 'models/semester.model';

export default interface SemesterOverviewDto {
  totalSubject: number;
  selectedSemester: Semester;
}
