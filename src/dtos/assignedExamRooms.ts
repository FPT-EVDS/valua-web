import Room from 'models/room.model';
import SubjectExaminee from 'models/subjectExaminee.model';

export default interface AssignedExamRooms {
  totalExaminees: number;
  examRooms: Array<{
    room: Room;
    attendances: Array<{
      attendanceId: string | null;
      subjectExaminee: SubjectExaminee;
      position: number;
      startTime: Date | null;
      finishTime: Date | null;
    }>;
  }>;
}
