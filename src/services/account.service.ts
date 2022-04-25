/* eslint-disable sonarjs/no-duplicate-string */
import { AxiosResponse } from 'axios';
import AccountOverviewDto from 'dtos/accountOverview.dto';
import AccountsDto from 'dtos/accounts.dto';
import AppUserDto from 'dtos/appUser.dto';
import AppUserDtoStatus from 'dtos/appUserDtoStatus';
import ImportExcelDto from 'dtos/importExcel.dto';
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
  updateAccountEmbedding: (
    appUserId: string,
    payload: FormData,
  ): Promise<AxiosResponse<string>> => {
    const url = `/accounts/embed/${String(appUserId)}`;
    return axiosClient.put(url, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
  getAccountOverview: (): Promise<AxiosResponse<AccountOverviewDto>> => {
    const url = '/accounts/overview';
    return axiosClient.get(url);
  },
  import: (payload: FormData): Promise<AxiosResponse<ImportExcelDto[]>> => {
    const url = '/accounts/import';
    return axiosClient.post(url, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  downloadFailedImportFile: (path: string): Promise<AxiosResponse> => {
    const url = `/${path}`;
    return axiosClient.get(url, {
      responseType: 'blob',
      headers: {
        Accept: '*/*',
      },
    });
  },
  deleteFailedImportFile: (fileNames: string[]): Promise<AxiosResponse> => {
    const url = '/accounts/failedImports/delete';
    return axiosClient.post(url, {
      fileNames,
    });
  },
};

export default accountServices;
