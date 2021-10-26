import ExamRoom from 'models/examRoom.model';

import PagingDto from './paging.dto';

export default interface ExamRoomsDto extends PagingDto {
  examRooms: ExamRoom[];
}
