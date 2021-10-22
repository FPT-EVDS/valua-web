import Subject from 'models/subject.model';
import SubjectExaminee from 'models/subjectExaminee.model';

import PagingDto from './paging.dto';
import SearchParams from './searchParams.dto';

export default interface DetailSubjectExamineeDto
  extends SearchParams,
    PagingDto {
  totalUnassignedExaminees: number;
  totalExaminees: 2;
  subject: Pick<Subject, 'subjectId' | 'subjectCode' | 'subjectName'>;
  examinees: Array<SubjectExaminee>;
}
