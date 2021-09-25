import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import SemesterDto from 'dtos/semester.dto';
import SemestersDto from 'dtos/semesters.dto';
import Semester from 'models/semester.model';
import semesterServices from 'services/semester.service';

interface SemestersState {
  isLoading: boolean;
  error: string;
  current: SemestersDto;
}

export const getSemesters = createAsyncThunk(
  'semesters',
  async (numOfPage: number, { rejectWithValue }) => {
    try {
      const response = await semesterServices.getSemesters(numOfPage);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const addSemester = createAsyncThunk(
  'semesters/add',
  async (payload: SemesterDto, { rejectWithValue }) => {
    try {
      const response = await semesterServices.addSemester(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const disableSemester = createAsyncThunk(
  'semesters/disable',
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

// Define the initial state using that type
const initialState: SemestersState = {
  isLoading: false,
  error: '',
  current: {
    semesters: [] as Semester[],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  },
};

export const semesterSlice = createSlice({
  name: 'semester',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getSemesters.fulfilled, (state, action) => {
        state.current = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(addSemester.fulfilled, (state, action) => {
        state.current.semesters.unshift(action.payload);
        state.error = '';
        state.isLoading = false;
      })
      .addCase(disableSemester.fulfilled, (state, action) => {
        const index = state.current.semesters.findIndex(
          semester => semester.semesterId === action.payload.semesterId,
        );
        state.current.semesters[index].isActive = action.payload.isActive;
        state.error = '';
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(getSemesters.rejected, addSemester.rejected, disableSemester.rejected),
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        },
      )
      .addMatcher(
        isAnyOf(getSemesters.pending, addSemester.pending, disableSemester.pending),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      );
  },
});

export default semesterSlice.reducer;
