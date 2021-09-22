import Role from './role.model';

type Account = {
  appUserId: string;
  email: string;
  fullName: string;
  gender: string;
  role: Role;
  birthdate: string;
  address: string;
  isActive: boolean;
  phoneNumber: string;
  imageUrl: string | null;
  lastModifiedDate: Date;
  createdDate: Date;
  studentId: string | null;
  classCode: string | null;
};

export default Account;
