import Subject from 'models/subject.model';

export default interface AddedExamineeSubject {
  addedExamineeNumber: number;
  semesterName: string;
  subject: Pick<Subject, 'subjectId' | 'subjectCode' | 'subjectName'>;
}
