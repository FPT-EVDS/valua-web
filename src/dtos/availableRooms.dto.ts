import Room from 'models/room.model';

export default interface AvailableRoomsDto {
  availableRooms: Pick<
    Room,
    'roomId' | 'seatCount' | 'roomName' | 'floor' | 'status'
  >[];
  totalRooms: number;
}
