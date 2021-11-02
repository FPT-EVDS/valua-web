import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import AssignStaffToExamRoomDto from 'dtos/assignStaffToExamRoom.dto';
import ExamRoomsDto from 'dtos/examRooms.dto';
import SearchExamRoomsDto from 'dtos/searchExamRooms.dto';
import examRoomServices from 'services/examRoom.service';

interface ExamRoomState {
  isLoading: boolean;
  error: string;
  current: ExamRoomsDto;
  shiftId: string;
}

export const getExamRooms = createAsyncThunk(
  'examRooms',
  async (payload: SearchExamRoomsDto, { rejectWithValue }) => {
    try {
      const response = await examRoomServices.getListExamRooms(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const assignStaff = createAsyncThunk(
  'addExamRoom/assignStaff',
  async (payload: AssignStaffToExamRoomDto, { rejectWithValue }) => {
    try {
      const response = await examRoomServices.assignStaff(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

// Define the initial state using that type
const initialState: ExamRoomState = {
  isLoading: false,
  error: '',
  shiftId: '',
  current: {
    examRooms: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  },
};

export const examRoomsSlice = createSlice({
  name: 'examRoom',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getExamRooms.fulfilled, (state, action) => {
        state.shiftId = action.meta.arg.shiftId;
        state.current = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(assignStaff.fulfilled, (state, action) => {
        const index = state.current.examRooms.findIndex(
          item => item.examRoomID === action.payload.examRoomID,
        );
        if (index > -1) state.current.examRooms[index] = action.payload;
        state.isLoading = false;
        state.error = '';
      })
      .addMatcher(
        isAnyOf(getExamRooms.rejected),
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        },
      )
      .addMatcher(isAnyOf(getExamRooms.pending), state => {
        state.isLoading = true;
        state.error = '';
      });
  },
});

export default examRoomsSlice.reducer;
