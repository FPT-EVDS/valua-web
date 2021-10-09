import User from 'models/user.model';

export default interface LoginUser {
  appUser: User;
  token: string;
}
