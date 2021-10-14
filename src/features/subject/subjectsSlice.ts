import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  isPending,
  isRejected,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { SearchByNameDto } from 'dtos/searchByName.dto';
import SubjectDto from 'dtos/subject.dto';
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

export const addSubject = createAsyncThunk(
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

export const updateSubject = createAsyncThunk(
  'subjects/update',
  async (payload: SubjectDto, { rejectWithValue }) => {
    try {
      const response = await subjectServices.updateSubject(payload);
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

export const searchBySubjectName = createAsyncThunk(
  'rooms/searchByName',
  async (payload: SearchByNameDto, { rejectWithValue }) => {
    try {
      const response = await subjectServices.searchSubjects(payload);
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
      .addCase(addSubject.fulfilled, (state, action) => {
        if (state.current.currentPage === 0)
          state.current.subjects.unshift(action.payload);
        state.current.totalItems += 1;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        const index = state.current.subjects.findIndex(
          subject => subject.subjectId === action.payload.subjectId,
        );
        state.current.subjects[index] = action.payload;
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
        isAnyOf(getSubjects.fulfilled, searchBySubjectName.fulfilled),
        (state, action) => {
          state.current = action.payload;
          state.error = '';
          state.isLoading = false;
        },
      )
      .addMatcher(isRejected, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addMatcher(isPending, state => {
        state.isLoading = true;
        state.error = '';
      });
  },
});

export default subjectSlice.reducer;
