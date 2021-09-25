import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import LoginDto from 'dtos/login.dto';
import Role from 'enums/role.enum';
import User from 'models/user.model';
import authServices from 'services/auth.service';

import { RootState } from '../../app/store';

interface UserState {
  isLoading: boolean;
  error: string;
  user: User | null;
}

export const login = createAsyncThunk(
  'authentication/login',
  async (payload: LoginDto, { rejectWithValue }) => {
    try {
      const response = await authServices.login(payload);
      const { token, role } = response.data;
      if (role === Role.Manager || role === Role.ShiftManager)
        localStorage.setItem('access_token', token);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

// Define the initial state using that type
const initialState: UserState = {
  isLoading: false,
  error: '',
  user: null,
};

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    [login.pending.type]: (state, action) => {
      state.isLoading = true;
      state.error = '';
    },
    [login.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [login.fulfilled.type]: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = '';
      state.isLoading = false;
    },
  },
});

export const selectUser = (state: RootState) => state.user.user;

export default authSlice.reducer;
