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
import Room from 'models/room.model';
import Semester from 'models/semester.model';
import Shift from 'models/shift.model';
import Subject from 'models/subject.model';
import SubjectExaminee from 'models/subjectExaminee.model';
import examRoomServices from 'services/examRoom.service';
import shiftServices from 'services/shift.service';

interface ExamRoomState {
  isLoading: boolean;
  error: string;
  shift: Shift | null;
  currentSubject: {
    semester: Pick<Semester, 'semesterId' | 'semesterName'>;
    subject: Subject;
    subjectSemesterId: string;
  } | null;
  shouldUpdateDropdown: boolean;
  examRooms: AvailableExamineesDto | null;
  removedExaminees: SubjectExaminee[];
}

// Define the initial state using that type
const initialState: ExamRoomState = {
  shift: null,
  currentSubject: null,
  isLoading: false,
  error: '',
  examRooms: null,
  shouldUpdateDropdown: false,
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
    updateDropdown: (state, action: PayloadAction<boolean>) => {
      state.shouldUpdateDropdown = action.payload;
    },
    addExamRooms: (state, action: PayloadAction<Room[]>) => {
      if (state.examRooms) {
        const addedExamRooms = action.payload.map(room => ({
          room,
          attendances: [],
        }));
        state.examRooms.examRooms = [
          ...state.examRooms.examRooms,
          ...addedExamRooms,
        ];
      }
    },
    updateExamRoom: (
      state,
      action: PayloadAction<AvailableExamineesDto | null>,
    ) => {
      state.examRooms = action.payload;
    },
    addRemovedExaminee: (
      state,
      action: PayloadAction<{ examinee: SubjectExaminee; roomId: string }>,
    ) => {
      if (state.examRooms) {
        const roomIndex = state.examRooms.examRooms.findIndex(
          examRoom => examRoom.room.roomId === action.payload.roomId,
        );
        const examRoom = state.examRooms.examRooms[roomIndex];
        examRoom.attendances = examRoom.attendances.filter(
          attendance =>
            attendance.subjectExaminee.subjectExamineeId !==
            action.payload.examinee.subjectExamineeId,
        );
        state.examRooms.examRooms[roomIndex] = examRoom;
      }
      state.removedExaminees = [
        ...state.removedExaminees,
        action.payload.examinee,
      ];
    },
    updateRoomExaminees: (
      state,
      action: PayloadAction<{ examinees: SubjectExaminee[]; roomId: string }>,
    ) => {
      if (state.examRooms) {
        const roomIndex = state.examRooms.examRooms.findIndex(
          examRoom => examRoom.room.roomId === action.payload.roomId,
        );
        const examRoom = state.examRooms.examRooms[roomIndex];
        const newAttendances = action.payload.examinees.map(
          (examinee, index) => ({
            attendanceId: null,
            subjectExaminee: examinee,
            position: index,
            startTime: null,
            finishTime: null,
          }),
        );
        examRoom.attendances = newAttendances;
        state.examRooms.examRooms[roomIndex] = examRoom;
      }
      const addedExamineeIds = new Set(
        action.payload.examinees.map(examinee => examinee.subjectExamineeId),
      );
      state.removedExaminees = state.removedExaminees.filter(
        examinee => !addedExamineeIds.has(examinee.subjectExamineeId),
      );
    },
    updateTotalExaminees: (state, action: PayloadAction<number>) => {
      if (state.examRooms) {
        state.examRooms.totalExaminees = action.payload;
      }
    },
    updateCurrentSubject: (
      state,
      action: PayloadAction<{
        semester: Pick<Semester, 'semesterId' | 'semesterName'>;
        subject: Subject;
        subjectSemesterId: string;
      } | null>,
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
      .addCase(createExamRoom.fulfilled, (state, action) => {
        if (state.examRooms) {
          const addedExamRooms = new Set(
            action.payload.result.map(examRoom => examRoom.room.roomId),
          );
          const examRooms = state.examRooms.examRooms.filter(
            examRoom => !addedExamRooms.has(examRoom.room.roomId),
          );
          state.examRooms.examRooms = examRooms;
        }
        state.isLoading = false;
        state.error = '';
      })
      .addCase(getAvailableExaminees.fulfilled, (state, action) => {
        state.removedExaminees = [];
        state.examRooms = action.payload;
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

export const {
  addRemovedExaminee,
  addExamRooms,
  updateCurrentSubject,
  updateTotalExaminees,
  updateRoomExaminees,
  updateExamRoom,
  updateDropdown,
} = addExamRoomSlice.actions;

export default addExamRoomSlice.reducer;
