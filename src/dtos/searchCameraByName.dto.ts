import Status from 'enums/status.enum';

export interface SearchCameraDto {
  search: string;
  page: number;
  status?: Status;
  beginDate?: Date;
  endDate?: Date;
}
