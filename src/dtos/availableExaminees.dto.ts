import Examinee from 'models/examinee.model';

export default interface AvailableExamineesDto {
  totalExaminees: number;
  examinees: Array<Examinee>;
}
