import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import AppUserDto from 'dtos/appUser.dto';
import ShiftDto from 'dtos/shift.dto';
import Shift from 'models/shift.model';
import accountServices from 'services/account.service';
import shiftServices from 'services/shift.service';

interface DetailShiftState {
  isLoading: boolean;
  error: string;
  shift: Shift | null;
}

export const getShift = createAsyncThunk(
  'detailShift/detail',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await shiftServices.getShift(id);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const addShift = createAsyncThunk(
  'detailShift/add',
  async (payload: ShiftDto, { rejectWithValue }) => {
    try {
      const response = await shiftServices.addShift(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const updateShift = createAsyncThunk(
  'detailShift/update',
  async (payload: ShiftDto, { rejectWithValue }) => {
    try {
      const response = await shiftServices.updateShift(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

// Define the initial state using that type
const initialState: DetailShiftState = {
  isLoading: false,
  error: '',
  shift: null,
};

export const detailShiftSlice = createSlice({
  name: 'detailShift',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        isAnyOf(getShift.fulfilled, addShift.fulfilled, updateShift.fulfilled),
        (state, action) => {
          state.shift = action.payload;
          state.error = '';
          state.isLoading = false;
        },
      )
      .addMatcher(
        isAnyOf(getShift.pending, addShift.pending, updateShift.pending),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      )
      .addMatcher(
        isAnyOf(getShift.rejected, addShift.rejected, updateShift.rejected),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      );
  },
});

export default detailShiftSlice.reducer;
