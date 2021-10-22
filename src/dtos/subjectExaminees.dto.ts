export default interface SubjectExamineesDto {
  semesterId: string;
  subjectId: string;
  examineeList: Array<{ email: string }>;
}
