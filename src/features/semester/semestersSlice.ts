import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import SearchSemesterParamsDto from 'dtos/searchSemesterParams.dto';
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

export const updateSemester = createAsyncThunk(
  'semesters/update',
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

export const activeSemester = createAsyncThunk(
  'semesters/active',
  async (semesterId: string, { rejectWithValue }) => {
    try {
      const response = await semesterServices.activeSemester(semesterId);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const searchBySemesterName = createAsyncThunk(
  'semesters/searchByName',
  async (payload: SearchSemesterParamsDto, { rejectWithValue }) => {
    try {
      const response = await semesterServices.searchSemestersByName(payload);
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
      .addCase(addSemester.fulfilled, (state, action) => {
        if (state.current.currentPage === 0)
          state.current.semesters.unshift({ ...action.payload, subjects: [] });
        state.current.totalItems += 1;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(updateSemester.fulfilled, (state, action) => {
        const index = state.current.semesters.findIndex(
          semester => semester.semesterId === action.payload.semesterId,
        );
        state.current.semesters[index] = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(disableSemester.fulfilled, activeSemester.fulfilled),
        (state, action) => {
          const index = state.current.semesters.findIndex(
            semester => semester.semesterId === action.payload.semesterId,
          );
          state.current.semesters[index].isActive = action.payload.isActive;
          state.error = '';
          state.isLoading = false;
        },
      )
      .addMatcher(
        isAnyOf(getSemesters.fulfilled, searchBySemesterName.fulfilled),
        (state, action) => {
          state.current = action.payload;
          state.error = '';
          state.isLoading = false;
        },
      )
      .addMatcher(
        isAnyOf(
          addSemester.rejected,
          updateSemester.rejected,
          disableSemester.rejected,
          getSemesters.rejected,
          searchBySemesterName.rejected,
          activeSemester.rejected,
        ),
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        },
      )
      .addMatcher(
        isAnyOf(
          addSemester.pending,
          updateSemester.pending,
          disableSemester.pending,
          getSemesters.pending,
          searchBySemesterName.pending,
          activeSemester.pending,
        ),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      );
  },
});

export default semesterSlice.reducer;
