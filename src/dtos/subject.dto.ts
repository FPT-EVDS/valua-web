import Tool from 'models/tool.model';

export default interface SubjectDto {
  subjectId: string | null;
  subjectName: string;
  subjectCode: string;
  tools: Tool[];
}
