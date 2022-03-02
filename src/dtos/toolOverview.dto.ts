import Tool from 'models/tool.model';

export default interface ToolOverviewDto {
  totalTools: number;
  unusedTools: Tool[];
  totalUnusedTools: number;
}
