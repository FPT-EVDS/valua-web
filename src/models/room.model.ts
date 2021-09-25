import User from 'models/role.model';

type Room = {
  roomId: string;
  manager: User;
  seatCount: number;
  roomName: string;
  floor: number;
  description: string;
  status: number;
  createdDate: string;
  lastModifiedDate: string;
};

export default Room;
