import Semester from 'models/semester.model';
import Shift from 'models/shift.model';

import PagingDto from './paging.dto';

interface ShiftsDto extends PagingDto {
  shifts: Array<Shift>;
  selectedSemester: Pick<Semester, 'semesterId' | 'semesterName'> | null;
}

export default ShiftsDto;
