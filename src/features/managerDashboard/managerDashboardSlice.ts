import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import AccountOverviewDto from 'dtos/accountOverview.dto';
import RoomOverviewDto from 'dtos/roomOverview.dto';
import SemesterOverviewDto from 'dtos/semesterOverview.dto';
import ToolOverviewDto from 'dtos/toolOverview.dto';
import accountServices from 'services/account.service';
import roomServices from 'services/room.service';
import semesterServices from 'services/semester.service';
import toolServices from 'services/tool.service';

interface ManagerDashboardState {
  account: {
    data: AccountOverviewDto | null;
    isLoading: boolean;
    error: string;
  };
  room: {
    data: RoomOverviewDto | null;
    isLoading: boolean;
    error: string;
  };
  semester: {
    data: SemesterOverviewDto | null;
    isLoading: boolean;
    error: string;
  };
  tool: {
    data: ToolOverviewDto | null;
    isLoading: boolean;
    error: string;
  };
}

export const getAccountOverview = createAsyncThunk(
  'manager/account',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await accountServices.getAccountOverview();
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const getRoomOverview = createAsyncThunk(
  'manager/room',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await roomServices.getRoomOverview();
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const getSemesterOverview = createAsyncThunk(
  'manager/semester',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await semesterServices.getSemesterOverview();
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const getToolOverview = createAsyncThunk(
  'manager/tool',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await toolServices.getToolOverview();
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

// Define the initial state using that type
const initialState: ManagerDashboardState = {
  account: {
    data: null,
    error: '',
    isLoading: false,
  },
  room: {
    data: null,
    error: '',
    isLoading: false,
  },
  semester: {
    data: null,
    error: '',
    isLoading: false,
  },
  tool: {
    data: null,
    error: '',
    isLoading: false,
  },
};

export const managerDashboardSlice = createSlice({
  name: 'manager',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAccountOverview.fulfilled, (state, action) => {
        state.account.data = action.payload;
        state.account.error = '';
        state.account.isLoading = false;
      })
      .addCase(getAccountOverview.rejected, (state, action) => {
        state.account.error = String(action.payload);
        state.account.isLoading = false;
      })
      .addCase(getAccountOverview.pending, state => {
        state.account.error = '';
        state.account.isLoading = true;
      })
      .addCase(getRoomOverview.fulfilled, (state, action) => {
        state.room.data = action.payload;
        state.room.error = '';
        state.room.isLoading = false;
      })
      .addCase(getRoomOverview.rejected, (state, action) => {
        state.room.error = String(action.payload);
        state.room.isLoading = false;
      })
      .addCase(getRoomOverview.pending, state => {
        state.room.error = '';
        state.room.isLoading = true;
      })
      .addCase(getSemesterOverview.fulfilled, (state, action) => {
        state.semester.data = action.payload;
        state.semester.error = '';
        state.semester.isLoading = false;
      })
      .addCase(getSemesterOverview.rejected, (state, action) => {
        state.semester.error = String(action.payload);
        state.semester.isLoading = false;
      })
      .addCase(getSemesterOverview.pending, state => {
        state.semester.error = '';
        state.semester.isLoading = true;
      })
      .addCase(getToolOverview.fulfilled, (state, action) => {
        state.tool.data = action.payload;
        state.tool.error = '';
        state.tool.isLoading = false;
      })
      .addCase(getToolOverview.rejected, (state, action) => {
        state.tool.error = String(action.payload);
        state.tool.isLoading = false;
      })
      .addCase(getToolOverview.pending, state => {
        state.tool.error = '';
        state.tool.isLoading = true;
      });
  },
});

export default managerDashboardSlice.reducer;
