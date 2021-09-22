import Role from 'models/role.model';

interface AppUserDto {
  fullName: string;
  email: string;
  phoneNumber: string;
  birthdate: Date;
  address: string;
  gender: number;
  roleID: number;
  imageUrl: string | null;
  studentId: string | null;
  classCode: string | null;
}

export default AppUserDto;
