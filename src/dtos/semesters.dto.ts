import Semester from 'models/semester.model';

import PagingDto from './paging.dto';

interface SemestersDto extends PagingDto {
  semesters: Array<Semester>;
}

export default SemestersDto;
