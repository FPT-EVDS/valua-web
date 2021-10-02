import Shift from 'models/shift.model';

import PagingDto from './paging.dto';

interface ShiftsDto extends PagingDto {
  shifts: Array<Shift>;
}

export default ShiftsDto;
