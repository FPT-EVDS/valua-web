import Report from 'models/report.model';

import PagingDto from './paging.dto';

interface ReportsDto extends PagingDto {
  reports: Array<Report>;
}

export default ReportsDto;
