import Room from 'models/room.model';

interface OccupiedRoom extends Room {
  lastPosition: number;
}

export default interface AvailableRoomsDto {
  occupiedRooms: Array<OccupiedRoom>;
  emptyRooms: Array<Room>;
  totalRooms: number;
}
