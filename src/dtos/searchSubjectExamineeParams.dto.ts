import SearchByNameDto from './searchByName.dto';

export interface SearchSubjectExamineeParams extends SearchByNameDto {
  semesterId: string;
  subjectId: string;
}
