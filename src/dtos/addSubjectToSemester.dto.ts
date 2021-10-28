import Subject from 'models/subject.model';

export default interface AddSubjectToSemesterDto {
  semesterId: string;
  subjects: Subject[];
}
