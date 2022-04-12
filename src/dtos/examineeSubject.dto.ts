import Subject from 'models/subject.model';

import PagingDto from './paging.dto';

export default interface ExamineeSubject extends PagingDto {
  subjects: Array<{
    totalExaminees: number;
    totalUnassigned: number;
    subject: {
      subject: Pick<Subject, 'subjectId' | 'subjectCode' | 'subjectName'>;
      subjectSemesterId: string;
    };
    isReady: boolean;
  }>;
}
