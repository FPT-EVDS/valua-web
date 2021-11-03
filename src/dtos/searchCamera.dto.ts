import Status from 'enums/status.enum';

import SearchByDateDto from './searchByDate.dto';
import SearchByNameDto from './searchByName.dto';
import SearchParams from './searchParams.dto';

export interface SearchCameraDto
  extends SearchParams,
    SearchByNameDto,
    SearchByDateDto {
  status?: Status;
}
