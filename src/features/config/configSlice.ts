import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import Config from 'models/config.model';
import configServices from 'services/config.service';

interface ConfigState {
  isLoading: boolean;
  error: string;
  config: Config | null;
}

export const getConfig = createAsyncThunk(
  'configs',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await configServices.getConfig();
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const updateConfig = createAsyncThunk(
  'configs/update',
  async (payload: Config, { rejectWithValue }) => {
    try {
      const response = await configServices.updateConfig(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

const initialState: ConfigState = {
  isLoading: false,
  error: '',
  config: null,
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        isAnyOf(getConfig.fulfilled, updateConfig.fulfilled),
        (state, action) => {
          state.config = action.payload;
          state.error = '';
          state.isLoading = false;
        },
      )
      .addMatcher(isAnyOf(getConfig.pending, updateConfig.pending), state => {
        state.isLoading = true;
        state.error = '';
      })
      .addMatcher(
        isAnyOf(getConfig.rejected, updateConfig.rejected),
        (state, action) => {
          state.isLoading = false;
          state.error = String(action.payload);
        },
      );
  },
});

export default configSlice.reducer;
