import Role from 'enums/role.enum';
import Status from 'enums/status.enum';

import SearchByNameDto from './searchByName.dto';
import SearchParams from './searchParams.dto';

export default interface SearchAccountDto
  extends SearchByNameDto,
    SearchParams {
  status?: Status;
  role?: Role | string;
}
