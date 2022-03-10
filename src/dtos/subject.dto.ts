import Tool from 'models/tool.model';

export default interface SubjectDto {
  subjectId: string | null;
  numberOfExam: number;
  subjectName: string;
  subjectCode: string;
  tools: Tool[];
}
