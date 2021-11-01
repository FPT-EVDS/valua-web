import Room from "models/room.model";
import User from "models/user.model";

export default interface ExamRoomDto {
  examRoomID: string | null;
  examRoomName: string;
  staff: User | null;
  room: Room | null;
}
