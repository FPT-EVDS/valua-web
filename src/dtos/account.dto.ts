import Account from 'models/account.model';

import PagingDto from './paging.dto';

interface AccountDto extends PagingDto {
  accounts: Array<Account>;
}

export default AccountDto;
