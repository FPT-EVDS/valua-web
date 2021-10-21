import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import SearchParams from 'dtos/searchParams.dto';
import ShiftDto from 'dtos/shift.dto';
import ShiftsDto from 'dtos/shifts.dto';
import Shift from 'models/shift.model';
import shiftServices from 'services/shift.service';

interface ShiftsState {
  isLoading: boolean;
  error: string;
  current: ShiftsDto;
}

export const getShifts = createAsyncThunk(
  'shifts',
  async (payload: SearchParams, { rejectWithValue }) => {
    try {
      const response = await shiftServices.getShifts(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const updateShift = createAsyncThunk(
  'shifts/update',
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

export const deleteShift = createAsyncThunk(
  'shifts/delete',
  async (shiftId: string, { rejectWithValue }) => {
    try {
      const response = await shiftServices.disableShift(shiftId);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const addShift = createAsyncThunk(
  'shifts/add',
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

// Define the initial state using that type
const initialState: ShiftsState = {
  isLoading: false,
  error: '',
  current: {
    shifts: [] as Shift[],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  },
};

export const shiftslice = createSlice({
  name: 'shift',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getShifts.fulfilled, (state, action) => {
        state.current = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(addShift.fulfilled, (state, action) => {
        if (state.current.currentPage === 0)
          state.current.shifts.unshift(action.payload);
        state.current.totalItems += 1;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(updateShift.fulfilled, (state, action) => {
        const index = state.current.shifts.findIndex(
          shift => shift.shiftId === action.payload.shiftId,
        );
        state.current.shifts[index] = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(deleteShift.fulfilled, (state, action) => {
        const index = state.current.shifts.findIndex(
          shift => shift.shiftId === action.payload.shiftId,
        );
        state.current.shifts[index].status = action.payload.status;
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

export default shiftslice.reducer;
