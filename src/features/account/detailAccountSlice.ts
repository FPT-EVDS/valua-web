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
        isAnyOf(getAccount.fulfilled, updateAccount.fulfilled),
        (state, action) => {
          state.account = action.payload;
          state.error = '';
          state.isLoading = false;
        },
      )
      .addMatcher(isAnyOf(getAccount.pending, updateAccount.pending), state => {
        state.isLoading = true;
        state.error = '';
      })
      .addMatcher(
        isAnyOf(getAccount.rejected, updateAccount.rejected),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      );
  },
});

export default detailAccountSlice.reducer;
