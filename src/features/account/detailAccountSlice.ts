import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
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

export const updateAccountEmbedding = createAsyncThunk(
  'detailAccount/updateEmbedding',
  async (
    { appUserId, formData }: { appUserId: string; formData: FormData },
    { rejectWithValue },
  ) => {
    try {
      const response = await accountServices.updateAccountEmbedding(
        appUserId,
        formData,
      );
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

export const activeAccount = createAsyncThunk(
  'detailAccount/active',
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

export const resetPassword = createAsyncThunk(
  'detailAccount/resetPassword',
  async (appUserId: string, { rejectWithValue }) => {
    try {
      const response = await accountServices.resetPassword(appUserId);
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
      .addMatcher(
        isAnyOf(resetPassword.fulfilled, updateAccountEmbedding.fulfilled),
        state => {
          state.error = '';
          state.isLoading = false;
        },
      )
      .addMatcher(
        isAnyOf(disableAccount.fulfilled, activeAccount.fulfilled),
        (state, action) => {
          if (state.account) state.account.isActive = action.payload.isActive;
          state.error = '';
          state.isLoading = false;
        },
      )
      .addMatcher(
        isAnyOf(getAccount.fulfilled, updateAccount.fulfilled),
        (state, action) => {
          state.account = action.payload;
          state.error = '';
          state.isLoading = false;
        },
      )
      .addMatcher(
        isAnyOf(
          resetPassword.pending,
          disableAccount.pending,
          activeAccount.pending,
          getAccount.pending,
          updateAccount.pending,
          updateAccountEmbedding.pending,
        ),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      )
      .addMatcher(
        isAnyOf(
          resetPassword.rejected,
          disableAccount.rejected,
          activeAccount.rejected,
          getAccount.rejected,
          updateAccount.rejected,
          updateAccountEmbedding.rejected,
        ),
        (state, action) => {
          state.isLoading = false;
          state.error = String(action.payload);
        },
      );
  },
});

export default detailAccountSlice.reducer;
