import { AxiosResponse } from 'axios';
import AccountsDto from 'dtos/accounts.dto';
import AppUserDto from 'dtos/appUser.dto';
import DisableAppUserDto from 'dtos/disableAppUser.dto';
import { SearchByNameDto } from 'dtos/searchByName.dto';
import Account from 'models/account.model';

import axiosClient from './axiosClient';

const accountServices = {
  getAccounts: (numOfPage: number): Promise<AxiosResponse<AccountsDto>> => {
    const url = `/accounts`;
    return axiosClient.get(url, { params: { numOfPage } });
  },
  getAccount: (id: string): Promise<AxiosResponse<Account>> => {
    const url = `/accounts/${id}`;
    return axiosClient.get(url, { params: { id } });
  },
  addAccount: (payload: AppUserDto): Promise<AxiosResponse<Account>> => {
    const url = '/accounts';
    return axiosClient.post(url, payload);
  },
  updateAccount: (payload: AppUserDto): Promise<AxiosResponse<Account>> => {
    const url = `/accounts/${String(payload.appUserId)}`;
    return axiosClient.put(url, payload);
  },
  disableAccount: (id: string): Promise<AxiosResponse<DisableAppUserDto>> => {
    const url = `/accounts/${id}`;
    return axiosClient.patch(url, [
      {
        op: 'replace',
        path: '/isActive',
        value: false,
      },
    ]);
  },
  getAllStaffForShift: (): Promise<AxiosResponse<Account[]>> => {
    const url = '/accounts/shiftManager/staff';
    return axiosClient.get(url);
  },
  searchStaffForShift: (fullName: string): Promise<AxiosResponse<Account>> => {
    const url = '/accounts/shiftManager/fullname';
    return axiosClient.get(url, { params: { fullName } });
  },
  searchAccounts: ({
    page,
    search,
  }: SearchByNameDto): Promise<AxiosResponse<AccountsDto>> => {
    const url = `/accounts/search`;
    return axiosClient.get(url, {
      params: { page, search },
    });
  },
};

export default accountServices;
