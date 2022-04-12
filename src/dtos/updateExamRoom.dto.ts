import Account from 'models/account.model';
import Room from 'models/room.model';
import Subject from 'models/subject.model';

export default interface UpdateExamRoomDto {
  examRoomId: string;
  staff: Pick<
    Account,
    | 'appUserId'
    | 'email'
    | 'fullName'
    | 'phoneNumber'
    | 'imageUrl'
    | 'companyId'
  > | null;
  room: Pick<Room, 'roomId' | 'seatCount' | 'roomName' | 'floor' | 'status'>;
  subject: Pick<Subject, 'subjectId' | 'subjectName' | 'subjectCode'>;
}
