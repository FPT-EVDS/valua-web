import StatusEnum from '../../enums/status.enum';
import User from './authentication.user.model';

type Account = {
  username: string;
  //password: string;
  lastLogin: string;
  status: StatusEnum;
  email: string;
  phoneNumber: string;
  createdDate: string;
  lastModified: string;
  lastModifiedBy: string;
  users: User[]
};

export default Account;
