import PagingDto from './paging.dto';
import RoomWithCamera from './roomWithCamera.dto';

interface RoomsDto extends PagingDto {
  rooms: Array<RoomWithCamera>;
}

export default RoomsDto;
