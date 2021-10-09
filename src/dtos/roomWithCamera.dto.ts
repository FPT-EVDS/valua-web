import Camera from 'models/camera.model';
import Room from 'models/room.model';

export default interface RoomWithCamera {
  camera: Camera | null;
  room: Room;
}
