import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import ExamineeSubject from 'dtos/examineeSubject.dto';
import SearchParams from 'dtos/searchParams.dto';
import SubjectExamineesDto from 'dtos/subjectExaminees.dto';
import Semester from 'models/semester.model';
import subjectExamineesServices from 'services/subjectExaminees.service';

interface SubjectsState {
  isLoading: boolean;
  selectedSemester: Pick<Semester, 'semesterId' | 'semesterName'> | null;
  error: string;
  current: ExamineeSubject;
}

export const searchSubjectBySemester = createAsyncThunk(
  'subjectExaminee/searchBySemester',
  async (
    payload: SearchParams & { semesterId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await subjectExamineesServices.searchBySemester(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const addExaminees = createAsyncThunk(
  'subjectExaminee/add',
  async (payload: SubjectExamineesDto[], { rejectWithValue }) => {
    try {
      const response = await subjectExamineesServices.add(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

// Define the initial state using that type
const initialState: SubjectsState = {
  isLoading: false,
  error: '',
  selectedSemester: null,
  current: {
    subjects: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  },
};

export const subjectExamineeSlice = createSlice({
  name: 'subjectExaminee',
  initialState,
  reducers: {
    updateSelectedSemester: (
      state,
      action: PayloadAction<Pick<
        Semester,
        'semesterId' | 'semesterName'
      > | null>,
    ) => {
      state.selectedSemester = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(searchSubjectBySemester.fulfilled, (state, action) => {
        state.current = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(addExaminees.fulfilled, (state, action) => {
        const { subjects } = state.current;
        action.payload.forEach(subject => {
          const index = subjects.findIndex(
            currentSubject =>
              currentSubject.subject.subjectId === subject.subject.subjectId,
          );
          if (index > -1) {
            subjects[index].totalExaminees += subject.addedExamineeNumber;
            subjects[index].totalUnassigned += subject.addedExamineeNumber;
            subjects[index].isReady = false;
          }
        });
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

export const { updateSelectedSemester } = subjectExamineeSlice.actions;

export default subjectExamineeSlice.reducer;
