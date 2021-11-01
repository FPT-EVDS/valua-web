import {
    createAsyncThunk,
    createSlice,
    isAnyOf,
    isPending,
    isRejected
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import Violation from 'models/violation.model';
import ViolationServices from 'services/violation.service';

interface DetailViolationState {
  isLoading: boolean;
  error: string;
  violation: Violation | null;
}

export const getViolation = createAsyncThunk(
  'detailViolation/detail',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await ViolationServices.getViolation(id);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);


// Define the initial state using that type
const initialState: DetailViolationState = {
  isLoading: false,
  error: '',
  violation: null,
};

export const detailViolationSlice = createSlice({
  name: 'detailCamera',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        isAnyOf(getViolation.fulfilled),
        (state, action) => {
          state.violation = action.payload;
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

export default detailViolationSlice.reducer;
