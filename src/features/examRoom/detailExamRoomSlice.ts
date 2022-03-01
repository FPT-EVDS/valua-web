import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import AddAttendanceDto from 'dtos/addAttendance.dto';
import UpdateExamRoomDto from 'dtos/updateExamRoom.dto';
import DetailExamRoom from 'models/detailExamRoom.model';
import Shift from 'models/shift.model';
import attendanceServices from 'services/attendance.service';
import examRoomServices from 'services/examRoom.service';
import shiftServices from 'services/shift.service';

interface ExamRoomState {
  isLoading: boolean;
  error: string;
  shift: Shift | null;
  examRoom: DetailExamRoom | null;
}

export const getShift = createAsyncThunk(
  'detailExamRoom/getShift',
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

export const getDetailExamRoom = createAsyncThunk(
  'detailExamRoom/detail',
  async (examRoomId: string, { rejectWithValue }) => {
    try {
      const response = await examRoomServices.getExamRoomDetail(examRoomId);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const updateExamRoom = createAsyncThunk(
  'detailExamRoom/update',
  async (payload: UpdateExamRoomDto, { rejectWithValue }) => {
    try {
      const response = await examRoomServices.updateExamRoom(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const removeAttendance = createAsyncThunk(
  'detailExamRoom/removeAttendance',
  async (payload: string, { rejectWithValue }) => {
    try {
      const response = await attendanceServices.removeAttendance(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const addAttendance = createAsyncThunk(
  'detailExamRoom/addAttendance',
  async (payload: AddAttendanceDto, { rejectWithValue }) => {
    try {
      const response = await attendanceServices.addAttendance(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const deleteExamRoom = createAsyncThunk(
  'detailExamRoom/deleteExamRoom',
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
  shift: null,
  error: '',
  examRoom: null,
};

export const detailExamRoomSlice = createSlice({
  name: 'detailExamRoom',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getShift.fulfilled, (state, action) => {
        state.shift = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(addAttendance.fulfilled, (state, action) => {
        state.examRoom?.attendances.push(action.payload);
        if (state.examRoom)
          state.examRoom.attendances = state.examRoom?.attendances.sort(
            (firstEl, secondEl) => firstEl.position - secondEl.position,
          );
        state.error = '';
        state.isLoading = false;
      })
      .addCase(removeAttendance.fulfilled, (state, action) => {
        if (state.examRoom) {
          const { attendances } = state.examRoom;
          state.examRoom.attendances = attendances.filter(
            seat => seat.attendanceId !== action.meta.arg,
          );
        }
        state.error = '';
        state.isLoading = false;
      })
      .addCase(deleteExamRoom.fulfilled, (state, action) => {
        if (state.examRoom) state.examRoom.status = action.payload.status;
        state.error = '';
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(getDetailExamRoom.fulfilled, updateExamRoom.fulfilled),
        (state, action) => {
          state.examRoom = {
            ...action.payload,
            attendances: action.payload.attendances.sort(
              (first, second) => first.position - second.position,
            ),
          };
          state.error = '';
          state.isLoading = false;
        },
      )
      .addMatcher(
        isAnyOf(
          getDetailExamRoom.rejected,
          updateExamRoom.rejected,
          getShift.rejected,
          addAttendance.rejected,
          removeAttendance.rejected,
          deleteExamRoom.rejected,
        ),
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        },
      )
      .addMatcher(
        isAnyOf(
          getDetailExamRoom.pending,
          updateExamRoom.pending,
          getShift.pending,
          addAttendance.pending,
          removeAttendance.pending,
          deleteExamRoom.pending,
        ),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      );
  },
});

export default detailExamRoomSlice.reducer;
