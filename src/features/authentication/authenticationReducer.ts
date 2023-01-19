import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import authenticationService from 'services/authentication.service';

import { RootState } from '../../app/store';
import Status from '../../enums/status.enum';
import LoginRequestDto from '../../dtos/authentication/loginRequest.dto';
import Account from '../../models/authentication/authentication.account.model';
import LoginResponseDto from '../../dtos/authentication/loginResponse.dto';

interface AuthState {
  isLoading: boolean;
  error: string;
  account: Account | null;
}

export const login = createAsyncThunk(
  'authentication/login',
  async (payload: LoginRequestDto, { rejectWithValue }) => {
    try {
      const response = await authenticationService.login(payload);
      //return response.data;
      // BEGIN MOCK RESPONSE
      const authenticationResult: LoginResponseDto = {
        token: 'conmeotoken',
        statusCode: 12200,
        account: {
          username: 'con meo',
          email: 'conmeo@gmail.com',
          lastLogin: '2023-10-12T04:27:13.369+00:00',
          createdDate: '2023-10-12T04:27:13.369+00:00',
          lastModified: '\'2023-10-12T04:27:13.369+00:00\'',
          lastModifiedBy: 'concho',
          status: Status.ACTIVE,
          phoneNumber: '123456789',
          users: [
            {
              firstName: 'con',
              lastName: 'meo',
              dateOfBirth: '2000-12-12',
              createdDate: '2023-10-12T04:27:13.369+00:00',
              lastModified: '\'2023-10-12T04:27:13.369+00:00\'',
              lastModifiedBy: 'concho',
              status: Status.INACTIVE,
              roles: [
                {
                  name: 'Admin',
                  status: Status.ACTIVE,
                  createdDate: '2023-10-12T04:27:13.369+00:00',
                  lastModified: '\'2023-10-12T04:27:13.369+00:00\'',
                  lastModifiedBy: 'concho',
                }
              ]
            }
          ]
        }
      }
      // END MOCK RESPONSE
      return authenticationResult;
    } catch (error) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  },
);

export const getUserProfile = createAsyncThunk(
  'authentication/profile',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await authenticationService.getUserProfile();
      return response.data;
    } catch (error) {
      console.log('Error while call profile: ' + error);
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);
// Define the initial state using that type
const initialState: AuthState = {
  isLoading: false,
  error: '',
  account: null,
};

export const authenticationReducer = createSlice({
  name: 'authentication',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        console.log('Logged in with account: ' + action.payload.account);
        state.account = action.payload.account;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(getUserProfile.rejected, state => {
        console.log(state.error);
        state.error = '';
      })
      // .addMatcher(
      //   isAnyOf(getUserProfile.fulfilled),
      //   (state, action) => {
      //     state.account = action.payload;
      //     state.error = '';
      //     state.isLoading = false;
      //   },
      // )
      .addMatcher(
        isAnyOf(
          login.pending,
          getUserProfile.pending,
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
        ),
        (state, action) => {
          state.isLoading = false;
          state.error = String(action.payload);
        },
      );
  },
});

export const selectAccount = (state: RootState) => state.authentication.account;

export default authenticationReducer.reducer;
