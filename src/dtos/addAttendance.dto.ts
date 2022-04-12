import Examinee from 'models/examinee.model';
import ExamRoom from 'models/examRoom.model';

export default interface AddAttendanceDto {
  examRoom: Pick<ExamRoom, 'examRoomId'>;
  subjectExaminee: Pick<Examinee, 'subjectExamineeId'>;
}
