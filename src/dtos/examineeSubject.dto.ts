import Subject from 'models/subject.model';

import PagingDto from './paging.dto';

export default interface ExamineeSubject extends PagingDto {
  subjects: Array<{
    totalExaminees: number;
    totalUnassigned: number;
    subject: Pick<Subject, 'subjectId' | 'subjectCode' | 'subjectName'>;
    isReady: boolean;
  }>;
}
