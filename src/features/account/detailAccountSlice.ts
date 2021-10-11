import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import AppUserDto from 'dtos/appUser.dto';
import Account from 'models/account.model';
import accountServices from 'services/account.service';

interface DetailAccountState {
  isLoading: boolean;
  error: string;
  account: Account | null;
}

export const getAccount = createAsyncThunk(
  'detailAccount/detail',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await accountServices.getAccount(id);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const updateAccount = createAsyncThunk(
  'detailAccount/update',
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
  'detailAccount/disable',
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
const initialState: DetailAccountState = {
  isLoading: false,
  error: '',
  account: null,
};

export const detailAccountSlice = createSlice({
  name: 'detailAccount',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(disableAccount.fulfilled, (state, action) => {
        if (state.account) state.account.isActive = action.payload.isActive;
      })
      .addMatcher(
        isAnyOf(getAccount.fulfilled, updateAccount.fulfilled),
        (state, action) => {
          state.account = action.payload;
          state.error = '';
          state.isLoading = false;
        },
      )
      .addMatcher(isPending, state => {
        state.isLoading = true;
        state.error = '';
      })
      .addMatcher(isRejected, state => {
        state.isLoading = false;
        state.error = '';
      });
  },
});

export default detailAccountSlice.reducer;
