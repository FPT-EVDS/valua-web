import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import SemesterDto from 'dtos/semester.dto';
import Semester from 'models/semester.model';
import semesterServices from 'services/semester.service';

interface DetailSemesterState {
  isLoading: boolean;
  error: string;
  semester: Semester | null;
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

// Define the initial state using that type
const initialState: DetailSemesterState = {
  isLoading: false,
  error: '',
  semester: null,
};

export const detailRoomSlice = createSlice({
  name: 'detailSemester',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(disableSemester.fulfilled, (state, action) => {
        if (state.semester) state.semester.isActive = action.payload.isActive;
      })
      .addCase(getSemester.fulfilled, (state, action) => {
        state.semester = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(updateSemester.fulfilled, (state, action) => {
        if (state.semester) state.semester = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addMatcher(isPending, state => {
        state.isLoading = true;
        state.error = '';
      })
      .addMatcher(isRejected, state => {
        state.isLoading = false;
        state.error = '';
      });
  },
});

export default detailRoomSlice.reducer;
