import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import ShiftDto from 'dtos/shift.dto';
import Shift from 'models/shift.model';
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

export const deleteShift = createAsyncThunk(
  'detailShift/delete',
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

export const startStaffing = createAsyncThunk(
  'detailShift/staffing',
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

export const lockShift = createAsyncThunk(
  'detailShift/lock',
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

// Define the initial state using that type
const initialState: DetailShiftState = {
  isLoading: false,
  error: '',
  shift: null,
};

export const detailShiftSlice = createSlice({
  name: 'detailShift',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(deleteShift.fulfilled, state => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        state = initialState;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(startStaffing.fulfilled, (state, action) => {
        // eslint-disable-next-line prefer-destructuring
        if (state.shift) state.shift.status = action.payload[0].status;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(lockShift.fulfilled, (state, action) => {
        // eslint-disable-next-line prefer-destructuring
        if (state.shift)
          state.shift.status = action.payload.lockedShifts[0].status;
        state.error = '';
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(getShift.fulfilled, addShift.fulfilled, updateShift.fulfilled),
        (state, action) => {
          state.shift = action.payload;
          state.error = '';
          state.isLoading = false;
        },
      )
      .addMatcher(
        isAnyOf(
          deleteShift.pending,
          getShift.pending,
          addShift.pending,
          updateShift.pending,
          startStaffing.pending,
          lockShift.pending,
        ),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      )
      .addMatcher(
        isAnyOf(
          deleteShift.rejected,
          getShift.rejected,
          addShift.rejected,
          updateShift.rejected,
          startStaffing.rejected,
          lockShift.rejected,
        ),
        (state, action) => {
          state.isLoading = false;
          state.error = String(action.payload);
        },
      );
  },
});

export const { reset } = detailShiftSlice.actions;

export default detailShiftSlice.reducer;
