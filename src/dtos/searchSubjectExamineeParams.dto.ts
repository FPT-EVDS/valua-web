import SearchByNameDto from './searchByName.dto';

export interface SearchSubjectExamineeParams extends SearchByNameDto {
  subjectSemesterId: string;
}
