import Subject from 'models/subject.model';

import PagingDto from './paging.dto';

export default interface AvailableSubjects extends PagingDto {
  subjects: Subject[];
}
