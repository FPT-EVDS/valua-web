export default interface Tool {
  toolId: string;
  toolCode: string;
  toolName: string;
  isActive: boolean;
  createdDate: Date;
  lastModifiedDate: Date;
}
