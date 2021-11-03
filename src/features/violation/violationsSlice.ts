import {
    createAsyncThunk,
    createSlice,
    isAnyOf,
    isPending,
    isRejected,
    PayloadAction
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { SearchViolationDto } from 'dtos/searchViolation.dto';
import ViolationsDto from 'dtos/violations.dto';
import Violation from 'models/violation.model';
import violationServices from 'services/violation.service';

interface ViolationState {
  isLoading: boolean;
  error: string;
  current: ViolationsDto;
}

export const getViolations = createAsyncThunk(
  'violations',
  async (numOfPage: number, { rejectWithValue }) => {
    try {
      const response = await violationServices.getViolations(numOfPage);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const searchViolation = createAsyncThunk(
  'violations/search',
  async (payload: SearchViolationDto, { rejectWithValue }) => {
    try {
      const response = await violationServices.searchViolations(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

const initialState: ViolationState = {
  isLoading: false,
  error: '',
  current: {
    violations: [] as Violation[],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  },
};

export const violationsSlice = createSlice({
  name: 'violation',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        isAnyOf(getViolations.fulfilled, searchViolation.fulfilled),
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

export default violationsSlice.reducer;
