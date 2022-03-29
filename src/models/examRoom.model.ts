import ExamRoomStatus from 'enums/examRoomStatus.enum';

import Account from './account.model';
import Room from './room.model';
import Semester from './semester.model';
import SubjectSemester from './subjectSemester.model';

export default interface ExamRoom {
  examRoomId: string;
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
  subjectSemester: SubjectSemester &
    Pick<Semester, 'semesterId' | 'semesterName'>;
  status: ExamRoomStatus;
}
