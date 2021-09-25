import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import AccountsDto from 'dtos/accounts.dto';
import AppUserDto from 'dtos/appUser.dto';
import Account from 'models/account.model';
import accountServices from 'services/account.service';

interface AccountState {
  isLoading: boolean;
  error: string;
  current: AccountsDto;
}

export const getAccounts = createAsyncThunk(
  'accounts',
  async (numOfPage: number, { rejectWithValue }) => {
    try {
      const response = await accountServices.getAccounts(numOfPage);
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
  extraReducers: builder => {
    builder
      .addCase(getAccounts.fulfilled, (state, action) => {
        state.current = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(addAccount.fulfilled, (state, action) => {
        state.current.accounts.unshift(action.payload);
        state.error = '';
        state.isLoading = false;
      })
      .addCase(disableAccount.fulfilled, (state, action) => {
        const index = state.current.accounts.findIndex(
          account => account.appUserId === action.payload.appUserId,
        );
        state.current.accounts[index].isActive = action.payload.isActive;
        state.error = '';
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(
          getAccounts.rejected,
          addAccount.rejected,
          disableAccount.rejected,
        ),
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        },
      )
      .addMatcher(
        isAnyOf(
          getAccounts.pending,
          addAccount.pending,
          disableAccount.pending,
        ),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      );
  },
});

export default accountSlice.reducer;
