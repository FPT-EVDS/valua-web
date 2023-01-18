import StatusEnum from '../../enums/status.enum';
import Role from '../user/role.model';

type User = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  status: StatusEnum;
  createdDate: string;
  lastModified: string;
  lastModifiedBy: string;
  roles: Role[];
};

export default User;
