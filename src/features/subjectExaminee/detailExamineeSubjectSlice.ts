import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import DetailSubjectExamineeDto from 'dtos/detailSubjectExaminee';
import { SearchSubjectExamineeParams } from 'dtos/searchSubjectExamineeParams.dto';
import subjectExamineesServices from 'services/subjectExaminees.service';

interface DetailExamineeSubjectState {
  examineeSubject: DetailSubjectExamineeDto | null;
  isLoading: boolean;
  error: string;
}

export const getExamineeSubjectDetail = createAsyncThunk(
  'examineeSubjectDetail/detail',
  async (payload: SearchSubjectExamineeParams, { rejectWithValue }) => {
    try {
      const response = await subjectExamineesServices.getDetail(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

// Define the initial state using that type
const initialState: DetailExamineeSubjectState = {
  isLoading: false,
  error: '',
  examineeSubject: null,
};

export const detailShiftSlice = createSlice({
  name: 'examineeSubjectDetail',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getExamineeSubjectDetail.fulfilled, (state, action) => {
        state.examineeSubject = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addMatcher(isAnyOf(getExamineeSubjectDetail.pending), state => {
        state.isLoading = true;
        state.error = '';
      })
      .addMatcher(
        isAnyOf(getExamineeSubjectDetail.rejected),
        (state, action) => {
          state.isLoading = false;
          state.error = String(action.payload);
        },
      );
  },
});

export default detailShiftSlice.reducer;
