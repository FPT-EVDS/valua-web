export default interface SubjectExamineesDto {
  semesterName: string;
  subjectCode: string;
  examineeList: Array<{ email: string }>;
}
