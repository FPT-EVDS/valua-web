import Subject from 'models/subject.model';

export default interface AvailableShiftDto {
  recommendedSeatsInRoom: number;
  availableSubjects: Array<{
    numOfAvailable: number;
    subject: Pick<
      Subject,
      'subjectId' | 'subjectName' | 'subjectCode' | 'numberOfExam'
    >;
  }>;
}
