import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import CameraDto from 'dtos/camera.dto';
import CamerasDto from 'dtos/cameras.dto';
import Camera from 'models/camera.model';
import cameraServices from 'services/camera.service';

interface CameraState {
  isLoading: boolean;
  error: string;
  current: CamerasDto;
}

export const getCameras = createAsyncThunk(
  'cameras',
  async (numOfPage: number, { rejectWithValue }) => {
    try {
      const response = await cameraServices.getCameras(numOfPage);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const addCamera = createAsyncThunk(
  'cameras/add',
  async (payload: CameraDto, { rejectWithValue }) => {
    try {
      const response = await cameraServices.addCamera(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const disableCamera = createAsyncThunk(
  'cameras/disable',
  async (cameraId: string, { rejectWithValue }) => {
    try {
      const response = await cameraServices.disableCamera(cameraId);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const activateCamera = createAsyncThunk(
  'cameras/activate',
  async (cameraId: string, { rejectWithValue }) => {
    try {
      const response = await cameraServices.activateCamera(cameraId);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

const initialState: CameraState = {
  isLoading: false,
  error: '',
  current: {
    cameras: [] as Camera[],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  },
};

export const camerasSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getCameras.fulfilled, (state, action) => {
        state.current = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(addCamera.fulfilled, (state, action) => {
        state.current.cameras.unshift(action.payload);
        state.error = '';
        state.isLoading = false;
      })
      .addCase(disableCamera.fulfilled, (state, action) => {
        const index = state.current.cameras.findIndex(
          camera => camera.cameraId === action.payload.cameraId,
        );
        state.current.cameras[index].status = action.payload.status;
        state.error = '';
        state.isLoading = false;
      })
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

export default camerasSlice.reducer;
