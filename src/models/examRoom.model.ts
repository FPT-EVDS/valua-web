import Room from "./room.model";
import User from "./user.model";

export default interface ExamRoom {
  examRoomID: string;
  examRoomName: string;
  staff: User | null;
  room: Room | null;
}
