import ExamRoomStatus from 'enums/examRoomStatus.enum';

import Account from './account.model';
import Room from './room.model';
import Subject from './subject.model';

export default interface ExamRoom {
  examRoomID: string;
  examRoomName: string;
  staff: Pick<
    Account,
    | 'appUserId'
    | 'email'
    | 'fullName'
    | 'phoneNumber'
    | 'imageUrl'
    | 'companyId'
  >;
  room: Pick<Room, 'roomId' | 'seatCount' | 'roomName' | 'floor' | 'status'>;
  subject: Pick<Subject, 'subjectId' | 'subjectName' | 'subjectCode'>;
  status: ExamRoomStatus;
}
