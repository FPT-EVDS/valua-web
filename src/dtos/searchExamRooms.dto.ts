import SearchByNameDto from './searchByName.dto';

export default interface SearchExamRoomsDto extends SearchByNameDto {
  shiftId: string;
}
