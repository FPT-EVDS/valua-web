import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import Camera from 'models/camera.model';
import cameraServices from 'services/camera.service';

interface DetailCameraState {
  isLoading: boolean;
  error: string;
  camera: Camera | null;
}

export const getCamera = createAsyncThunk(
  'getAccountDetail',
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

// Define the initial state using that type
const initialState: DetailCameraState = {
  isLoading: false,
  error: '',
  camera: null,
};

export const detailCameraSlice = createSlice({
  name: 'detailAccount',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getCamera.fulfilled, (state, action) => {
        state.camera = action.payload;
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

export default detailCameraSlice.reducer;
