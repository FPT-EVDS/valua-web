import {
    createAsyncThunk,
    createSlice,
    isAnyOf,
    isPending,
    isRejected
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import FeedbackDto from 'dtos/feedback.dto';
import Feedback from 'models/feedback.model';
import feedbackServices from 'services/feedback.service';

interface DetailFeedbackState {
  isLoading: boolean;
  error: string;
  feedback: Feedback | null;
}

export const getFeedback = createAsyncThunk(
  'detailFeedback/detail',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await feedbackServices.getFeedback(id);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const updateFeedback = createAsyncThunk(
  'detailFeedback/update',
  async (payload: FeedbackDto, { rejectWithValue }) => {
    try {
      const response = await feedbackServices.updateFeedback(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

// Define the initial state using that type
const initialState: DetailFeedbackState = {
  isLoading: false,
  error: '',
  feedback: null,
};

export const detailFeedbackSlice = createSlice({
  name: 'detailFeedback',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addMatcher(
        isAnyOf(getFeedback.fulfilled, updateFeedback.fulfilled),
        (state, action) => {
          state.feedback = action.payload;
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

export default detailFeedbackSlice.reducer;
