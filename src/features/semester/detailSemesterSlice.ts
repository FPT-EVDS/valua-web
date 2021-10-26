import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { AddSubjectToSemesterDto } from 'dtos/addSubjectToSemester.dto';
import { RemoveSubjectFromSemesterDto } from 'dtos/removeSubjectFromSemester.dto';
import SemesterDto from 'dtos/semester.dto';
import Semester from 'models/semester.model';
import Subject from 'models/subject.model';
import semesterServices from 'services/semester.service';

interface DetailSemesterState {
  isLoading: boolean;
  error: string;
  semester: Semester | null;
  semesterSubjects: Array<Subject>;
  canAddSubjects: boolean;
}

export const getSemester = createAsyncThunk(
  'detailSemester/detail',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await semesterServices.getSemester(id);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const updateSemester = createAsyncThunk(
  'detailSemester/update',
  async (payload: SemesterDto, { rejectWithValue }) => {
    try {
      const response = await semesterServices.updateSemester(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const disableSemester = createAsyncThunk(
  'detailSemester/disable',
  async (semesterId: string, { rejectWithValue }) => {
    try {
      const response = await semesterServices.disableSemester(semesterId);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const addSubjectsToSemester = createAsyncThunk(
  'detailSemester/addSubjects',
  async (payload: AddSubjectToSemesterDto, { rejectWithValue }) => {
    try {
      const response = await semesterServices.addSubjects(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const removeSubjectFromSemester = createAsyncThunk(
  'detailSemester/removeSubject',
  async (payload: RemoveSubjectFromSemesterDto, { rejectWithValue }) => {
    try {
      const response = await semesterServices.removeSubject(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

// Define the initial state using that type
const initialState: DetailSemesterState = {
  isLoading: false,
  error: '',
  semester: null,
  semesterSubjects: [],
  canAddSubjects: false,
};

export const detailRoomSlice = createSlice({
  name: 'detailSemester',
  initialState,
  reducers: {
    searchSemesterSubjects: (state, action: PayloadAction<string>) => {
      if (state.semester) {
        const searchValue = action.payload.toLowerCase();
        state.semesterSubjects = state.semester.subjects.filter(subject => {
          const { subjectCode, subjectName } = subject;
          return (
            subjectCode.toLowerCase().includes(searchValue) ||
            subjectName.toLowerCase().includes(searchValue)
          );
        });
      }
    },
    enableAddSubject: state => {
      state.canAddSubjects = true;
    },
    disableAddSubject: state => {
      state.canAddSubjects = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(disableSemester.fulfilled, (state, action) => {
        if (state.semester) state.semester.isActive = action.payload.isActive;
        state.isLoading = false;
        state.error = '';
      })
      .addCase(updateSemester.fulfilled, (state, action) => {
        if (state.semester) state.semester = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(
          getSemester.fulfilled,
          addSubjectsToSemester.fulfilled,
          removeSubjectFromSemester.fulfilled,
        ),
        (state, action) => {
          state.semester = action.payload;
          state.semesterSubjects = action.payload.subjects;
          state.error = '';
          state.isLoading = false;
        },
      )
      .addMatcher(
        isAnyOf(
          disableSemester.pending,
          updateSemester.pending,
          getSemester.pending,
          addSubjectsToSemester.pending,
          removeSubjectFromSemester.pending,
        ),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      )
      .addMatcher(
        isAnyOf(
          disableSemester.rejected,
          updateSemester.rejected,
          getSemester.rejected,
          addSubjectsToSemester.rejected,
          removeSubjectFromSemester.rejected,
        ),
        (state, action) => {
          state.isLoading = false;
          state.error = String(action.payload);
        },
      );
  },
});

export const { searchSemesterSubjects, enableAddSubject, disableAddSubject } =
  detailRoomSlice.actions;

export default detailRoomSlice.reducer;
