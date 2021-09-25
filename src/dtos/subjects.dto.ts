import Subject from 'models/subject.model';

import PagingDto from './paging.dto';

interface SubjectsDto extends PagingDto {
  subjects: Array<Subject>;
}

export default SubjectsDto;
