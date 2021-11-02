import Room from "./room.model";
import Subject from "./subject.model";
import User from "./user.model";

export default interface ExamRoom {
  examRoomID: string;
  examRoomName: string;
  staff: User | null;
  room: Room | null;
  subject: Subject;
}
