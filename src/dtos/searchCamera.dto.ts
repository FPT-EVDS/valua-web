import Status from 'enums/status.enum';

import SearchByNameDto from './searchByName.dto';
import SearchParams from './searchParams.dto';

export interface SearchCameraDto extends SearchParams, SearchByNameDto {
  status?: Status;
  beginDate?: Date;
  endDate?: Date;
}
