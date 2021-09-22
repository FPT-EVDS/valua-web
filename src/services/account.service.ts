import { AxiosResponse } from 'axios';
import AccountDto from 'dtos/account.dto';
import AppUserDto from 'dtos/appUser.dto';
import DisableAppUser from 'dtos/disableAppUser.dto';
import Account from 'models/account.model';

import axiosClient from './axiosClient';

const accountServices = {
  getAccounts: (numOfPage: number): Promise<AxiosResponse<AccountDto>> => {
    const url = `/accounts`;
    return axiosClient.get(url, { params: { numOfPage } });
  },
  addAccount: (payload: AppUserDto): Promise<AxiosResponse<Account>> => {
    const url = '/accounts';
    return axiosClient.post(url, payload);
  },
  updateAccount: (payload: AppUserDto): Promise<AxiosResponse<Account>> => {
    const url = '/accounts';
    return axiosClient.put(url, payload);
  },
  disableAccount: (id: string): Promise<AxiosResponse<DisableAppUser>> => {
    const url = `/accounts/${id}`;
    return axiosClient.patch(url, [
      {
        op: 'replace',
        path: '/isActive',
        value: false,
      },
    ]);
  },
};

export default accountServices;
