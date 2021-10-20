import Role from 'enums/role.enum';
import Status from 'enums/status.enum';

export default interface SearchAccountDto {
  search: string;
  page: number;
  status?: Status;
  role?: Role | string;
  sort?: string;
}
