import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import SemesterDto from 'dtos/semester.dto';
import SemestersDto from 'dtos/semesters.dto';
import ShiftDto from 'dtos/shift.dto';
import ShiftsDto from 'dtos/shifts.dto';
import Semester from 'models/semester.model';
import Shift from 'models/shift.model';
import semesterServices from 'services/semester.service';
import shiftServices from 'services/shift.service';

interface ShiftsState {
  isLoading: boolean;
  error: string;
  current: ShiftsDto;
}

export const getShifts = createAsyncThunk(
  'shifts',
  async (numOfPage: number, { rejectWithValue }) => {
    try {
      const response = await shiftServices.getShifts(numOfPage);
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

export const disableShift = createAsyncThunk(
  'shifts/disable',
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
      .addCase(updateShift.fulfilled, (state, action) => {
        const index = state.current.shifts.findIndex(
          shift => shift.shiftId === action.payload.shiftId,
        );
        state.current.shifts[index] = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(disableShift.fulfilled, (state, action) => {
        const index = state.current.shifts.findIndex(
          shift => shift.shiftId === action.payload.shiftId,
        );
        state.current.shifts[index].isActive = action.payload.isActive;
        state.error = '';
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(
          getShifts.rejected,
          disableShift.rejected,
          updateShift.rejected,
        ),
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        },
      )
      .addMatcher(
        isAnyOf(getShifts.pending, disableShift.pending, updateShift.pending),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      );
  },
});

export default shiftslice.reducer;
