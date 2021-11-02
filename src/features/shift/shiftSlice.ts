import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { format } from 'date-fns';
import SearchShiftParamsDto from 'dtos/searchShiftParams.dto';
import ShiftDto from 'dtos/shift.dto';
import ShiftsDto from 'dtos/shifts.dto';
import Semester from 'models/semester.model';
import Shift from 'models/shift.model';
import shiftServices from 'services/shift.service';

interface ShiftsState {
  isLoading: boolean;
  error: string;
  current: ShiftsDto;
  semester: Pick<Semester, 'semesterId' | 'semesterName'> | null;
  activeShiftDates: Record<string, number> | null;
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

export const getShiftCalendar = createAsyncThunk(
  'shifts/calendar',
  async (semesterId: string, { rejectWithValue }) => {
    try {
      const response = await shiftServices.getShiftCalendar(semesterId);
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
  semester: null,
  activeShiftDates: null,
  error: '',
  current: {
    selectedDate: null,
    shifts: [] as Shift[],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  },
};

export const shiftSlice = createSlice({
  name: 'shift',
  initialState,
  reducers: {
    updateShiftSemester: (
      state,
      action: PayloadAction<Pick<
        Semester,
        'semesterId' | 'semesterName'
      > | null>,
    ) => {
      state.semester = action.payload;
      state.current.selectedDate = null;
    },
    updateCurrentSelectedDate: (state, action: PayloadAction<Date | null>) => {
      state.current.selectedDate = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getShifts.fulfilled, (state, action) => {
        if (state.semester === null) {
          state.semester = action.payload.shifts[0].semester;
        }
        state.current = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(getShiftCalendar.fulfilled, (state, action) => {
        state.activeShiftDates = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(addShift.fulfilled, (state, action) => {
        const parsedBeginTime = format(
          new Date(action.payload.beginTime),
          'yyyy-MM-dd',
        );
        if (state.activeShiftDates) {
          if (state.activeShiftDates[parsedBeginTime] !== undefined)
            state.activeShiftDates[parsedBeginTime] += 1;
          else state.activeShiftDates[parsedBeginTime] = 1;
        }
        if (
          state.current.selectedDate &&
          format(new Date(state.current.selectedDate), 'yyyy-MM-dd') ===
            parsedBeginTime
        )
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
      .addCase(getShiftCalendar.rejected, (state, action) => {
        state.current = initialState.current;
        state.activeShiftDates = null;
        state.isLoading = false;
        state.error = String(action.payload);
      })
      .addCase(getShifts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = String(action.payload);
      })
      .addMatcher(
        isAnyOf(
          getShifts.rejected,
          addShift.rejected,
          updateShift.rejected,
          deleteShift.rejected,
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
          getShiftCalendar.pending,
        ),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      );
  },
});

export const { updateShiftSemester, updateCurrentSelectedDate } =
  shiftSlice.actions;

export default shiftSlice.reducer;
