import Account from 'models/account.model';

import PagingDto from './paging.dto';

interface AccountsDto extends PagingDto {
  accounts: Array<Account>;
}

export default AccountsDto;
