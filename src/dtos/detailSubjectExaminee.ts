import Semester from 'models/semester.model';
import Subject from 'models/subject.model';
import SubjectExaminee from 'models/subjectExaminee.model';

import PagingDto from './paging.dto';
import SearchParams from './searchParams.dto';

export default interface DetailSubjectExamineeDto
  extends SearchParams,
    PagingDto {
  totalUnassignedExaminees: number;
  subject: Pick<
    Subject,
    'subjectId' | 'subjectCode' | 'subjectName' | 'numberOfExam'
  >;
  semester: Pick<Semester, 'semesterId' | 'semesterName'>;
  examinees: Array<SubjectExaminee>;
}
