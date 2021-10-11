import Role from './role.model';

type Account = {
  appUserId: string;
  email: string;
  fullName: string;
  gender: number;
  role: Role;
  birthdate: Date;
  address: string;
  isActive: boolean;
  phoneNumber: string;
  imageUrl: string | null;
  lastModifiedDate: Date;
  createdDate: Date;
  companyId: string | null;
  classCode: string | null;
};

export default Account;
