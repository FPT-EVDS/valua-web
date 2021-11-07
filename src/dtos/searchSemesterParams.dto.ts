import SearchByNameDto from 'dtos/searchByName.dto';

export default interface SearchSemesterParamsDto extends SearchByNameDto {
  beginDate?: Date;
  endDate?: Date;
}
