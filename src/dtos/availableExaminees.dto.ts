import Examinee from 'models/examinee.model';

export default interface AvailableExamineesDto {
  examinees: Examinee[];
  totalExaminees: number;
}
