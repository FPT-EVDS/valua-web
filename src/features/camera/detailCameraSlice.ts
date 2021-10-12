import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import CameraDto from 'dtos/camera.dto';
import Camera from 'models/camera.model';
import cameraServices from 'services/camera.service';

interface DetailCameraState {
  isLoading: boolean;
  error: string;
  camera: Camera | null;
}

export const getCamera = createAsyncThunk(
  'detailCamera/detail',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await cameraServices.getCamera(id);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const updateCamera = createAsyncThunk(
  'detailCamera/update',
  async (payload: CameraDto, { rejectWithValue }) => {
    try {
      const response = await cameraServices.updateCamera(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const disableCamera = createAsyncThunk(
  'detailCamera/disable',
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
  'detailCamera/activate',
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

// Define the initial state using that type
const initialState: DetailCameraState = {
  isLoading: false,
  error: '',
  camera: null,
};

export const detailCameraSlice = createSlice({
  name: 'detailCamera',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(disableCamera.fulfilled, (state, action) => {
        if (state.camera) state.camera.status = action.payload.status;
      })
      .addMatcher(
        isAnyOf(getCamera.fulfilled, updateCamera.fulfilled),
        (state, action) => {
          state.camera = action.payload;
          state.error = '';
          state.isLoading = false;
        },
      )
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

export default detailCameraSlice.reducer;
