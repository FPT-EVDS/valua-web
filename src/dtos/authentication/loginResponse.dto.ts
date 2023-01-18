import Account from '../../models/authentication/authentication.account.model';
import ResponseDto from '../commons/response.dto';

export default interface LoginResponseDto extends ResponseDto {
  token: string;
  account: Account;
}
