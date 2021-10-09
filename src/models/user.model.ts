type User = {
  appUserId: string;
  email: string;
  fullName: string;
  gender: string;
  role: string;
  birthdate: Date;
  address: string;
  isActive: boolean;
  phoneNumber: string;
  profileImageUrl?: string | null;
  refreshToken?: string;
  companyId: string;
};

export default User;
