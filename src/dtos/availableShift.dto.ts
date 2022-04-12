import Semester from 'models/semester.model';
import Subject from 'models/subject.model';

export default interface AvailableShiftDto {
  recommendedSeatsInRoom: number;
  availableSubjects: Array<{
    numOfAvailable: number;
    subject: {
      semester: Pick<Semester, 'semesterId' | 'semesterName'>;
      subject: Subject;
      subjectSemesterId: string;
    };
  }>;
}
