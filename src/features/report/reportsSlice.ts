import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import ReportsDto from 'dtos/reports.dto';
import SearchByNameDto from 'dtos/searchByName.dto';
import reportServices from 'services/report.service';

interface ReportState {
  isLoading: boolean;
  error: string;
  current: ReportsDto;
}

export const getReports = createAsyncThunk(
  'reports',
  async (payload: SearchByNameDto, { rejectWithValue }) => {
    try {
      const response = await reportServices.getReports(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

// Define the initial state using that type
const initialState: ReportState = {
  isLoading: false,
  error: '',
  current: {
    reports: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  },
};

export const reportsSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getReports.fulfilled, (state, action) => {
        state.current = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(getReports.pending, state => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(getReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = String(action.payload);
      });
  },
});

export default reportsSlice.reducer;
