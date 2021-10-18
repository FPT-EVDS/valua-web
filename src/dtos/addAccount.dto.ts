import AppUserDto from './appUser.dto';

export default interface AddAccountDto {
  account: AppUserDto;
  image: File | null;
}
