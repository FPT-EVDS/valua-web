export default interface Room {
  roomId: string;
  seatCount: number;
  roomName: string;
  floor: number;
  description: string;
  status: number;
  createdDate: Date;
  lastModifiedDate: Date;
}
