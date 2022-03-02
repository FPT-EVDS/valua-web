import { AxiosResponse } from 'axios';
import AccountOverview from 'dtos/accountOverview.dto';
import AccountsDto from 'dtos/accounts.dto';
import AppUserDto from 'dtos/appUser.dto';
import AppUserDtoStatus from 'dtos/appUserDtoStatus';
import SearchAccountDto from 'dtos/searchAcount.dto';
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
  addAccount: (payload: FormData): Promise<AxiosResponse<Account>> => {
    const url = '/accounts';
    return axiosClient.post(url, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateAccount: (payload: AppUserDto): Promise<AxiosResponse<Account>> => {
    const url = `/accounts/${String(payload.appUserId)}`;
    return axiosClient.put(url, payload);
  },
  disableAccount: (id: string): Promise<AxiosResponse<AppUserDtoStatus>> => {
    const url = `/accounts/${id}`;
    return axiosClient.patch(url, [
      {
        op: 'replace',
        path: '/isActive',
        value: false,
      },
    ]);
  },
  activeAccount: (id: string): Promise<AxiosResponse<AppUserDtoStatus>> => {
    const url = `/accounts/${id}`;
    return axiosClient.patch(url, [
      {
        op: 'replace',
        path: '/isActive',
        value: true,
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
    role,
    sort,
    status,
  }: SearchAccountDto): Promise<AxiosResponse<AccountsDto>> => {
    const url = `/accounts`;
    return axiosClient.get(url, {
      params: { page, search, role, sort, status },
    });
  },
  resetPassword: (accountId: string): Promise<AxiosResponse<string>> => {
    const url = `/accounts/reset/${accountId}`;
    return axiosClient.post(url);
  },
  getAccountOverview: (): Promise<AxiosResponse<AccountOverview>> => {
    const url = '/accounts/overview';
    return axiosClient.get(url);
  },
};

export default accountServices;
