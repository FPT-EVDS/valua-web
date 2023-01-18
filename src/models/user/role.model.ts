import StatusEnum from '../../enums/status.enum';

type Role = {
  name: string;
  status: StatusEnum;
  createdDate: string;
  lastModified: string;
  lastModifiedBy: string;
};

export default Role;
