import Subject from './subject.model';

export default interface SubjectSemester {
  subjectSemesterId: string;
  subject: Pick<
    Subject,
    'subjectId' | 'subjectName' | 'subjectCode' | 'numberOfExam'
  >;
}
