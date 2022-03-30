import Account from 'models/account.model';
import Room from 'models/room.model';
import Shift from 'models/shift.model';
import SubjectExaminee from 'models/subjectExaminee.model';

export default interface CreateExamRoomResultDto {
  result: Array<{
    examRoomId: string;
    examRoomName: string;
    attendances: Array<{
      attendanceId: string | null;
      subjectExaminee: SubjectExaminee;
      position: number;
      startTime: Date | null;
      finishTime: Date | null;
    }>;
    createdDate: Date;
    lastModifiedDate: Date;
    room: Room;
    shift: Shift;
    staff: Account | null;
    status: number;
  }>;
}
