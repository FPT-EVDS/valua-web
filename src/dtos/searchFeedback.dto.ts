import Status from 'enums/status.enum';

export interface SearchFeedbackDto {
  search: string;
  page: number;
  status?: Status;
  beginDate?: Date;
  endDate?: Date;
}
