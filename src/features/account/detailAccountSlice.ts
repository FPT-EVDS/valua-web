import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import Account from 'models/account.model';
import accountServices from 'services/account.service';

interface DetailAccountState {
  isLoading: boolean;
  error: string;
  account: Account | null;
}

export const getAccount = createAsyncThunk(
  'getAccountDetail',
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
      .addCase(getAccount.fulfilled, (state, action) => {
        state.account = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addMatcher(isRejected, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addMatcher(isPending, state => {
        state.isLoading = true;
        state.error = '';
      });
  },
});

export default detailAccountSlice.reducer;
