import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import AccountDto from 'dtos/account.dto';
import AppUserDto from 'dtos/appUser.dto';
import DisableAppUser from 'dtos/disableAppUser.dto';
import Account from 'models/account.model';
import accountServices from 'services/account.service';

interface AccountState {
  isLoading: boolean;
  error: string;
  current: AccountDto;
}

export const getAccounts = createAsyncThunk(
  'accounts',
  async (payload: number, { rejectWithValue }) => {
    try {
      const response = await accountServices.getAccounts(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const addAccount = createAsyncThunk(
  'accounts/add',
  async (payload: AppUserDto, { rejectWithValue }) => {
    try {
      const response = await accountServices.addAccount(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const updateAccount = createAsyncThunk(
  'accounts/update',
  async (payload: AppUserDto, { rejectWithValue }) => {
    try {
      const response = await accountServices.updateAccount(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const disableAccount = createAsyncThunk(
  'accounts/disable',
  async (appUserId: string, { rejectWithValue }) => {
    try {
      const response = await accountServices.disableAccount(appUserId);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

// Define the initial state using that type
const initialState: AccountState = {
  isLoading: false,
  error: '',
  current: {
    accounts: [] as Account[],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  },
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {},
  extraReducers: {
    [(getAccounts.pending.type,
    addAccount.pending.type,
    updateAccount.pending.type,
    disableAccount.pending.type)]: state => {
      state.isLoading = true;
      state.error = '';
    },
    [(getAccounts.rejected.type,
    addAccount.rejected.type,
    updateAccount.rejected.type,
    disableAccount.rejected.type)]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [getAccounts.fulfilled.type]: (
      state,
      action: PayloadAction<AccountDto>,
    ) => {
      state.current = action.payload;
      state.error = '';
      state.isLoading = false;
    },
    [addAccount.fulfilled.type]: (state, action: PayloadAction<Account>) => {
      state.current.accounts = [...state.current.accounts, action.payload];
      state.error = '';
      state.isLoading = false;
    },
    [updateAccount.fulfilled.type]: (state, action: PayloadAction<Account>) => {
      const index = state.current.accounts.findIndex(
        account => account.appUserId === action.payload.appUserId,
      );
      state.current.accounts[index] = action.payload;
      state.error = '';
      state.isLoading = false;
    },
    [disableAccount.fulfilled.type]: (
      state,
      action: PayloadAction<DisableAppUser>,
    ) => {
      const index = state.current.accounts.findIndex(
        account => account.appUserId === action.payload.appUserId,
      );
      state.current.accounts[index].isActive = action.payload.isActive;
      state.error = '';
      state.isLoading = false;
    },
  },
});

export default accountSlice.reducer;
