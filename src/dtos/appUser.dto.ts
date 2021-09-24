import Role from 'models/role.model';

interface AppUserDto {
  appUserId: string | null;
  fullName: string;
  email: string;
  phoneNumber: string;
  birthdate: Date;
  address: string;
  gender: number;
  userRole: Role;
  imageUrl: string | null;
  studentId: string | null;
  classCode: string | null;
}

export default AppUserDto;
