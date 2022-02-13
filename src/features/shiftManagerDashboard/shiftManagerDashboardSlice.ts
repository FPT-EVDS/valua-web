import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import ReportDashboardDto from 'dtos/reportDashboard.dto';
import ShiftDashboardDto from 'dtos/shiftDashboard.dto';
import SubjectExamineesDashboardDto from 'dtos/subjectExamineeDashboard.dto';
import reportServices from 'services/report.service';
import shiftServices from 'services/shift.service';
import subjectExamineesServices from 'services/subjectExaminees.service';

interface Dashboardstate {
  subjectExaminee: {
    data: SubjectExamineesDashboardDto | null;
    isLoading: boolean;
    error: string;
  };
  report: {
    data: ReportDashboardDto | null;
    isLoading: boolean;
    error: string;
  };
  shift: {
    data: ShiftDashboardDto | null;
    isLoading: boolean;
    error: string;
  };
}

export const getSubjectExamineeOverview = createAsyncThunk(
  'shiftManager/subjectExaminees',
  async (_payload, { rejectWithValue }) => {
    try {
      const response =
        await subjectExamineesServices.getSubjectExamineeOverview();
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const getReportOverview = createAsyncThunk(
  'shiftManager/report',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await reportServices.getReportOverview();
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const getShiftOverview = createAsyncThunk(
  'shiftManager/shift',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await shiftServices.getShiftOverview();
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

// Define the initial state using that type
const initialState: Dashboardstate = {
  subjectExaminee: {
    data: null,
    error: '',
    isLoading: false,
  },
  report: {
    data: null,
    error: '',
    isLoading: false,
  },
  shift: {
    data: null,
    error: '',
    isLoading: false,
  },
};

export const shiftManagerDashboardSlice = createSlice({
  name: 'shiftManager',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getSubjectExamineeOverview.fulfilled, (state, action) => {
        state.subjectExaminee.data = action.payload;
        state.subjectExaminee.error = '';
        state.subjectExaminee.isLoading = false;
      })
      .addCase(getSubjectExamineeOverview.rejected, (state, action) => {
        state.subjectExaminee.error = String(action.payload);
        state.subjectExaminee.isLoading = false;
      })
      .addCase(getSubjectExamineeOverview.pending, state => {
        state.subjectExaminee.error = '';
        state.subjectExaminee.isLoading = true;
      })
      .addCase(getReportOverview.fulfilled, (state, action) => {
        state.report.data = action.payload;
        state.report.error = '';
        state.report.isLoading = false;
      })
      .addCase(getReportOverview.rejected, (state, action) => {
        state.report.error = String(action.payload);
        state.report.isLoading = false;
      })
      .addCase(getReportOverview.pending, state => {
        state.report.error = '';
        state.report.isLoading = true;
      })
      .addCase(getShiftOverview.fulfilled, (state, action) => {
        state.shift.data = action.payload;
        state.shift.error = '';
        state.shift.isLoading = false;
      })
      .addCase(getShiftOverview.rejected, (state, action) => {
        state.shift.error = String(action.payload);
        state.shift.isLoading = false;
      })
      .addCase(getShiftOverview.pending, state => {
        state.shift.error = '';
        state.shift.isLoading = true;
      });
  },
});

export default shiftManagerDashboardSlice.reducer;
