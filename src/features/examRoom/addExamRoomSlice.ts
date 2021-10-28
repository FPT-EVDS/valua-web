import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import Shift from 'models/shift.model';
import shiftServices from 'services/shift.service';

interface ExamRoomState {
  isLoading: boolean;
  error: string;
  shift: Shift | null;
  defaultExamRoomSize: number;
}

// Define the initial state using that type
const initialState: ExamRoomState = {
  shift: null,
  isLoading: false,
  error: '',
  defaultExamRoomSize: 20,
};

export const getShift = createAsyncThunk(
  'addExamRoom/getShift',
  async (shiftId: string, { rejectWithValue }) => {
    try {
      const response = await shiftServices.getShift(shiftId);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const addExamRoomSlice = createSlice({
  name: 'addExamRoom',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getShift.fulfilled, (state, action) => {
        state.shift = action.payload;
        state.isLoading = false;
        state.error = '';
      })
      .addMatcher(
        isAnyOf(getShift.rejected),
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        },
      )
      .addMatcher(isAnyOf(getShift.pending), state => {
        state.isLoading = true;
        state.error = '';
      });
  },
});

export default addExamRoomSlice.reducer;
