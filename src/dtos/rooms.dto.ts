import Room from 'models/room.model';

import PagingDto from './paging.dto';

interface RoomsDto extends PagingDto {
  rooms: Array<{ room: Room }>;
}

export default RoomsDto;
