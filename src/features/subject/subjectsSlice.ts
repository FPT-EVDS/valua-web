import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { SubjectDto } from 'dtos/subject.dto';
import SubjectsDto from 'dtos/subjects.dto';
import Subject from 'models/subject.model';
import subjectServices from 'services/subject.service';

interface SubjectsState {
  isLoading: boolean;
  error: string;
  current: SubjectsDto;
}

export const getSubjects = createAsyncThunk(
  'subjects',
  async (numOfPage: number, { rejectWithValue }) => {
    try {
      const response = await subjectServices.getSubjects(numOfPage);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const addSubjects = createAsyncThunk(
  'subjects/add',
  async (payload: SubjectDto, { rejectWithValue }) => {
    try {
      const response = await subjectServices.addSubject(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const disableSubject = createAsyncThunk(
  'subjects/disable',
  async (subjectId: string, { rejectWithValue }) => {
    try {
      const response = await subjectServices.disableSubject(subjectId);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

// Define the initial state using that type
const initialState: SubjectsState = {
  isLoading: false,
  error: '',
  current: {
    subjects: [] as Subject[],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  },
};

export const subjectSlice = createSlice({
  name: 'subject',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getSubjects.fulfilled, (state, action) => {
        state.current = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(addSubjects.fulfilled, (state, action) => {
        state.current.subjects.unshift(action.payload);
        state.error = '';
        state.isLoading = false;
      })
      .addCase(disableSubject.fulfilled, (state, action) => {
        const index = state.current.subjects.findIndex(
          subject => subject.subjectId === action.payload.subjectId,
        );
        state.current.subjects[index].isActive = action.payload.isActive;
        state.error = '';
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(
          getSubjects.rejected,
          addSubjects.rejected,
          disableSubject.rejected,
        ),
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        },
      )
      .addMatcher(
        isAnyOf(
          getSubjects.pending,
          addSubjects.pending,
          disableSubject.pending,
        ),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      );
  },
});

export default subjectSlice.reducer;
