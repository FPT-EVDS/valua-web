import Status from 'enums/status.enum';

export interface SearchViolationDto {
  search: string;
  page: number;
  status?: Status;
  beginDate?: Date;
  endDate?: Date;
}
