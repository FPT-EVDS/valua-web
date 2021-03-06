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
  'examRoom/assignStaff',
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

export const deleteExamRoom = createAsyncThunk(
  'examRoom/deleteExamRoom',
  async (examRoomId: string, { rejectWithValue }) => {
    try {
      const response = await examRoomServices.deleteExamRoom(examRoomId);
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
        const { payload } = action;
        state.current.examRooms = state.current.examRooms.map(examRoom => {
          if (examRoom.room.roomId === payload.room.roomId) {
            return {
              ...examRoom,
              room: payload.room,
              staff: payload.staff,
              status: payload.status,
            };
          }
          return examRoom;
        });
        state.isLoading = false;
        state.error = '';
      })
      .addCase(deleteExamRoom.fulfilled, (state, action) => {
        const index = state.current.examRooms.findIndex(
          item => item.examRoomId === action.meta.arg,
        );
        if (index > -1) state.current.examRooms.splice(index, 1);
        state.isLoading = false;
        state.error = '';
      })
      .addMatcher(
        isAnyOf(
          getExamRooms.rejected,
          assignStaff.rejected,
          deleteExamRoom.rejected,
        ),
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        },
      )
      .addMatcher(
        isAnyOf(
          getExamRooms.pending,
          assignStaff.pending,
          deleteExamRoom.pending,
        ),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      );
  },
});

export default examRoomsSlice.reducer;
