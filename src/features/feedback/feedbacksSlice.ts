import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  isPending,
  isRejected,
  PayloadAction
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import FeedbackDto from 'dtos/feedback.dto';
import FeedbacksDto from 'dtos/feedbacks.dto';
import { SearchFeedbackDto } from 'dtos/searchFeedback.dto';
import Feedback from 'models/feedback.model';
import feedbackServices from 'services/feedback.service';

interface FeedbackState {
  isLoading: boolean;
  error: string;
  current: FeedbacksDto;
}

export const getFeedbacks = createAsyncThunk(
  'feedbacks',
  async (numOfPage: number, { rejectWithValue }) => {
    try {
      const response = await feedbackServices.getFeedbacks(numOfPage);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const searchFeedback = createAsyncThunk(
  'feedbacks/search',
  async (payload: SearchFeedbackDto, { rejectWithValue }) => {
    try {
      const response = await feedbackServices.searchFeedbacks(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const addFeedback = createAsyncThunk(
  'feedbacks/create',
  async (payload: FeedbackDto, { rejectWithValue }) => {
    try {
      const response = await feedbackServices.addFeedback(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

const initialState: FeedbackState = {
  isLoading: false,
  error: '',
  current: {
    feedbacks: [] as Feedback[],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  },
};

export const feedbacksSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addFeedback.fulfilled, (state, action) => {
        if (state.current.currentPage === 0)
          state.current.feedbacks.unshift(action.payload);
        state.error = '';
        state.current.totalItems += 1;
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(getFeedbacks.fulfilled, searchFeedback.fulfilled),
        (state, action) => {
          state.current = action.payload;
          state.error = '';
          state.isLoading = false;
        },
      )
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

export default feedbacksSlice.reducer;
