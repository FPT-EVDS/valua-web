import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import AccountsDto from 'dtos/accounts.dto';
import SearchAccountDto from 'dtos/searchAcount.dto';
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

export const searchAccount = createAsyncThunk(
  'accounts/search',
  async (payload: SearchAccountDto, { rejectWithValue }) => {
    try {
      const response = await accountServices.searchAccounts(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const addAccount = createAsyncThunk(
  'accounts/add',
  async (payload: FormData, { rejectWithValue }) => {
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

export const activeAccount = createAsyncThunk(
  'accounts/active',
  async (appUserId: string, { rejectWithValue }) => {
    try {
      const response = await accountServices.activeAccount(appUserId);
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
      .addCase(addAccount.fulfilled, (state, action) => {
        if (state.current.currentPage === 0)
          state.current.accounts.unshift(action.payload);
        state.error = '';
        state.current.totalItems += 1;
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(getAccounts.fulfilled, searchAccount.fulfilled),
        (state, action) => {
          state.current = action.payload;
          state.error = '';
          state.isLoading = false;
        },
      )
      .addMatcher(
        isAnyOf(disableAccount.fulfilled, activeAccount.fulfilled),
        (state, action) => {
          const index = state.current.accounts.findIndex(
            account => account.appUserId === action.payload.appUserId,
          );
          state.current.accounts[index].isActive = action.payload.isActive;
          state.error = '';
          state.isLoading = false;
        },
      )
      .addMatcher(
        isAnyOf(
          addAccount.rejected,
          getAccounts.rejected,
          searchAccount.rejected,
          disableAccount.rejected,
          activeAccount.rejected,
        ),
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        },
      )
      .addMatcher(
        isAnyOf(
          addAccount.pending,
          getAccounts.pending,
          searchAccount.pending,
          disableAccount.pending,
          activeAccount.pending,
        ),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      );
  },
});

export default accountSlice.reducer;
