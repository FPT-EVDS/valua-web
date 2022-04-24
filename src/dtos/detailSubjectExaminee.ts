import Semester from 'models/semester.model';
import SubjectExaminee from 'models/subjectExaminee.model';
import SubjectSemester from 'models/subjectSemester.model';

import PagingDto from './paging.dto';

interface DetailSubjectExamineeSubjectSemester extends SubjectSemester {
  semester: Semester;
}

export default interface DetailSubjectExamineeDto extends PagingDto {
  totalUnassigned: number;
  totalExempted: number;
  totalAssigned: number;
  subjectSemester: DetailSubjectExamineeSubjectSemester;
  examinees: Array<SubjectExaminee>;
}
