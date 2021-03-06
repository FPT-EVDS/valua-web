import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import ChangePasswordDto from 'dtos/changePassword.dto';
import LoginDto from 'dtos/login.dto';
import User from 'models/user.model';
import authServices from 'services/auth.service';

import { RootState } from '../../app/store';

interface AuthState {
  isLoading: boolean;
  error: string;
  user: User | null;
}

export const login = createAsyncThunk(
  'authentication/login',
  async (payload: LoginDto, { rejectWithValue }) => {
    try {
      const response = await authServices.login(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const getUserProfile = createAsyncThunk(
  'authentication/profile',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await authServices.getUserProfile();
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  'authentication/profile',
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const response = await authServices.updateUserProfile(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const changePassword = createAsyncThunk(
  'authentication/changePassword',
  async (payload: ChangePasswordDto, { rejectWithValue }) => {
    try {
      const response = await authServices.changePassword(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);
// Define the initial state using that type
const initialState: AuthState = {
  isLoading: false,
  error: '',
  user: null,
};

export const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.appUser;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(changePassword.fulfilled, state => {
        state.error = '';
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(getUserProfile.fulfilled, updateUserProfile.fulfilled),
        (state, action) => {
          state.user = action.payload;
          state.error = '';
          state.isLoading = false;
        },
      )
      .addMatcher(
        isAnyOf(
          login.pending,
          getUserProfile.pending,
          updateUserProfile.pending,
          changePassword.pending,
        ),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      )
      .addMatcher(
        isAnyOf(
          login.rejected,
          getUserProfile.rejected,
          updateUserProfile.rejected,
          changePassword.rejected,
        ),
        (state, action) => {
          state.isLoading = false;
          state.error = String(action.payload);
        },
      );
  },
});

export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
