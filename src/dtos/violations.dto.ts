import Violation from 'models/violation.model';
import PagingDto from './paging.dto';


interface ViolationsDto extends PagingDto {
  violations: Array<Violation>;
}

export default ViolationsDto;
