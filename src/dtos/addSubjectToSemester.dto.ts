import Subject from 'models/subject.model';

export interface AddSubjectToSemesterDto {
  semesterId: string;
  subjects: Subject[];
}
