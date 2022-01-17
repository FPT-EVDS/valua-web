import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import ResolveReportDto from 'dtos/resolveReport.dto';
import Report from 'models/report.model';
import reportServices from 'services/report.service';

interface DetailReportState {
  isLoading: boolean;
  error: string;
  report: Report | null;
}

export const getReport = createAsyncThunk(
  'detailReport/detail',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await reportServices.getReport(id);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const resolveReport = createAsyncThunk(
  'detailReport/resolve',
  async (payload: ResolveReportDto, { rejectWithValue }) => {
    try {
      const response = await reportServices.resolveReport(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

// Define the initial state using that type
const initialState: DetailReportState = {
  isLoading: false,
  error: '',
  report: null,
};

export const detailReportSlice = createSlice({
  name: 'detailReport',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        isAnyOf(getReport.fulfilled, resolveReport.fulfilled),
        (state, action) => {
          state.report = action.payload;
          state.error = '';
          state.isLoading = false;
        },
      )
      .addMatcher(isAnyOf(getReport.pending, resolveReport.pending), state => {
        state.isLoading = true;
        state.error = '';
      })
      .addMatcher(
        isAnyOf(getReport.rejected, resolveReport.rejected),
        (state, action) => {
          state.isLoading = false;
          state.error = String(action.payload);
        },
      );
  },
});

export default detailReportSlice.reducer;
