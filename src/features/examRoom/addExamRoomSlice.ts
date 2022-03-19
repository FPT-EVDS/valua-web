import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import AvailableExamineesDto from 'dtos/availableExaminees.dto';
import CreateExamRoomDto from 'dtos/createExamRoom.dto';
import GetAvailableExamineesDto from 'dtos/getAvailableExaminees.dto';
import Examinee from 'models/examinee.model';
import Shift from 'models/shift.model';
import Subject from 'models/subject.model';
import examRoomServices from 'services/examRoom.service';
import shiftServices from 'services/shift.service';

interface ExamRoomState {
  isLoading: boolean;
  error: string;
  shift: Shift | null;
  currentSubject: Pick<
    Subject,
    'subjectId' | 'subjectName' | 'subjectCode'
  > | null;
  defaultExamRoomSize: number;
  examinees: AvailableExamineesDto | null;
  removedExaminees: Examinee[];
}

// Define the initial state using that type
const initialState: ExamRoomState = {
  shift: null,
  currentSubject: null,
  isLoading: false,
  error: '',
  defaultExamRoomSize: 20,
  examinees: null,
  removedExaminees: [],
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

export const createExamRoom = createAsyncThunk(
  'addExamRoom/createExamRoom',
  async (payload: CreateExamRoomDto[], { rejectWithValue }) => {
    try {
      const response = await examRoomServices.createExamRoom(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const getAvailableExaminees = createAsyncThunk(
  'addExamRoom/getAvailableExaminees',
  async (payload: GetAvailableExamineesDto, { rejectWithValue }) => {
    try {
      const response = await examRoomServices.getAvailableExaminees(payload);
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
  reducers: {
    updateRemovedExaminees: (state, action: PayloadAction<Examinee[]>) => {
      state.removedExaminees = action.payload;
    },
    updateExaminees: (state, action: PayloadAction<AvailableExamineesDto>) => {
      state.examinees = action.payload;
    },
    updateCurrentSubject: (
      state,
      action: PayloadAction<Pick<
        Subject,
        'subjectId' | 'subjectName' | 'subjectCode'
      > | null>,
    ) => {
      state.currentSubject = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getShift.fulfilled, (state, action) => {
        state.shift = action.payload;
        state.isLoading = false;
        state.error = '';
      })
      .addCase(createExamRoom.fulfilled, state => {
        state.removedExaminees = [];
        state.isLoading = false;
        state.error = '';
      })
      .addCase(getAvailableExaminees.fulfilled, (state, action) => {
        state.examinees = action.payload;
        state.isLoading = false;
        state.error = '';
      })
      .addMatcher(
        isAnyOf(
          getShift.rejected,
          createExamRoom.rejected,
          getAvailableExaminees.rejected,
        ),
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        },
      )
      .addMatcher(
        isAnyOf(
          getShift.pending,
          createExamRoom.pending,
          getAvailableExaminees.pending,
        ),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      );
  },
});

export const { updateRemovedExaminees, updateCurrentSubject, updateExaminees } =
  addExamRoomSlice.actions;

export default addExamRoomSlice.reducer;
