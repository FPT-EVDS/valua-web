import Roles from 'enums/role.enum';
import Role from 'models/role.model';

const roles: Role[] = [
  {
    roleID: 1,
    roleName: Roles.ShiftManager,
  },
  {
    roleID: 2,
    roleName: Roles.Staff,
  },
  {
    roleID: 3,
    roleName: Roles.Examinee,
  },
];

export default roles;
