import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import AutoAssignShiftDto from 'dtos/autoAssignShift.dto';
import SearchShiftParamsDto from 'dtos/searchShiftParams.dto';
import ShiftDto from 'dtos/shift.dto';
import ShiftDashboardDto from 'dtos/shiftDashboard.dto';
import ShiftOverviewParams from 'dtos/shiftOverviewParams.dto';
import ShiftsDto from 'dtos/shifts.dto';
import Shift from 'models/shift.model';
import examRoomServices from 'services/examRoom.service';
import shiftServices from 'services/shift.service';

interface ShiftsState {
  shift: {
    data: ShiftDashboardDto | null;
    isLoading: boolean;
    error: string;
  };
  isLoading: boolean;
  error: string;
  current: ShiftsDto;
}

export const getShifts = createAsyncThunk(
  'shifts',
  async (payload: SearchShiftParamsDto, { rejectWithValue }) => {
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

export const getShiftOverview = createAsyncThunk(
  'shifts/overview',
  async (payload: ShiftOverviewParams, { rejectWithValue }) => {
    try {
      const response = await shiftServices.getShiftOverview(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const startStaffing = createAsyncThunk(
  'shifts/staffing',
  async (payload: Pick<Shift, 'shiftId'>[], { rejectWithValue }) => {
    try {
      const response = await shiftServices.startStaffing(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const lockShifts = createAsyncThunk(
  'shifts/locking',
  async (payload: Pick<Shift, 'shiftId'>[], { rejectWithValue }) => {
    try {
      const response = await shiftServices.lockShifts(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const autoAssignShifts = createAsyncThunk(
  'shifts/auto',
  async (payload: AutoAssignShiftDto, { rejectWithValue }) => {
    try {
      const response = await shiftServices.autoAssignShift(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const autoAssignStaffs = createAsyncThunk(
  'shifts/autoAssignStaffs',
  async (semesterId: string, { rejectWithValue }) => {
    try {
      const response = await examRoomServices.autoAssignStaffs(semesterId);
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
  shift: {
    data: null,
    error: '',
    isLoading: false,
  },
  current: {
    shifts: [] as Shift[],
    selectedSemester: null,
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  },
};

export const shiftSlice = createSlice({
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
        if (
          state.current.currentPage === 0 &&
          state.current.selectedSemester?.semesterId ===
            action.payload.semester.semesterId
        )
          state.current.shifts.unshift({
            ...action.payload,
            numOfTotalRooms: 0,
            numOfTotalExaminees: 0,
          });
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
      .addCase(getShiftOverview.fulfilled, (state, action) => {
        state.shift.data = action.payload;
        state.shift.error = '';
        state.shift.isLoading = false;
      })
      .addCase(deleteShift.fulfilled, (state, action) => {
        const index = state.current.shifts.findIndex(
          shift => shift.shiftId === action.payload.shiftId,
        );
        state.current.shifts[index].status = action.payload.status;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(startStaffing.fulfilled, (state, action) => {
        action.payload.forEach(updatedShift => {
          const index = state.current.shifts.findIndex(
            shift => shift.shiftId === updatedShift.shiftId,
          );
          if (index > -1) {
            state.current.shifts[index].status = updatedShift.status;
          }
        });
        state.error = '';
        state.isLoading = false;
      })
      .addCase(autoAssignShifts.fulfilled, state => {
        // TODO: Update shifts here
        state.error = '';
        state.isLoading = false;
      })
      .addCase(autoAssignStaffs.fulfilled, state => {
        state.error = '';
        state.isLoading = false;
      })
      .addCase(lockShifts.fulfilled, (state, action) => {
        action.payload.lockedShifts.forEach(lockShift => {
          const index = state.current.shifts.findIndex(
            shift => shift.shiftId === lockShift.shiftId,
          );
          if (index > -1) {
            state.current.shifts[index].status = lockShift.status;
          }
        });
        state.error = '';
        state.isLoading = false;
      })
      .addCase(getShiftOverview.rejected, (state, action) => {
        state.shift.error = String(action.payload);
        state.shift.isLoading = false;
      })
      .addCase(getShiftOverview.pending, state => {
        state.shift.error = '';
        state.shift.isLoading = true;
      })
      .addMatcher(
        isAnyOf(
          addShift.rejected,
          updateShift.rejected,
          deleteShift.rejected,
          getShifts.rejected,
          startStaffing.rejected,
          lockShifts.rejected,
          autoAssignShifts.rejected,
          autoAssignStaffs.rejected,
        ),
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        },
      )
      .addMatcher(
        isAnyOf(
          getShifts.pending,
          addShift.pending,
          updateShift.pending,
          deleteShift.pending,
          autoAssignShifts.pending,
          autoAssignStaffs.pending,
        ),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      );
  },
});

export default shiftSlice.reducer;
