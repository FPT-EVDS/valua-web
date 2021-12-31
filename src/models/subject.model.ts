import Tool from './tool.model';

export default interface Subject {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  tools: Tool[];
  isActive: boolean;
  createdDate: string;
  lastModifiedDate: string;
}
