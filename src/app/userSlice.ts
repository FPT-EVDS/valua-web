import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError, AxiosResponse } from 'axios';
import LoginDto from 'dtos/login.dtos';
import User from 'models/user.models';
import authServices from 'services/auth.services';

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
      const { token } = response.data;
      localStorage.setItem('access_token', token);
      return response;
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

export const userSlice = createSlice({
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
    [login.fulfilled.type]: (
      state,
      action: PayloadAction<AxiosResponse<User>>,
    ) => {
      state.user = action.payload.data;
      state.error = '';
      state.isLoading = false;
    },
  },
});

export default userSlice.reducer;
