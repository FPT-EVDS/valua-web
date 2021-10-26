import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import accountReducer from 'features/account/accountsSlice';
import detailAccountReducer from 'features/account/detailAccountSlice';
import authReducer from 'features/auth/authSlice';
import cameraReducer from 'features/camera/camerasSlice';
import detailCameraReducer from 'features/camera/detailCameraSlice';
import examRoomReducer from 'features/examRoom/examRoomSlice';
import detailFeedbackReducer from 'features/feedback/detailFeedbackSlice';
import feedbackReducer from 'features/feedback/feedbacksSlice';
import detailRoomReducer from 'features/room/detailRoomSlice';
import roomReducer from 'features/room/roomsSlice';
import detailSemesterReducer from 'features/semester/detailSemesterSlice';
import semesterReducer from 'features/semester/semestersSlice';
import detailShiftReducer from 'features/shift/detailShiftSlice';
import shiftReducer from 'features/shift/shiftSlice';
import subjectReducer from 'features/subject/subjectsSlice';
import detailSubjectExamineeReducer from 'features/subjectExaminee/detailExamineeSubjectSlice';
import subjectExamineeReducer from 'features/subjectExaminee/subjectExamineeSlice';
import detailViolationReducer from 'features/violation/detailViolationSlice';
import violationReducer from 'features/violation/violationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountReducer,
    detailAccount: detailAccountReducer,
    room: roomReducer,
    detailRoom: detailRoomReducer,
    subjects: subjectReducer,
    semesters: semesterReducer,
    detailSemester: detailSemesterReducer,
    camera: cameraReducer,
    detailCamera: detailCameraReducer,
    shift: shiftReducer,
    detailShift: detailShiftReducer,
    violation: violationReducer,
    detailViolation: detailViolationReducer,
    feedback: feedbackReducer,
    detailFeedback: detailFeedbackReducer,
    subjectExaminee: subjectExamineeReducer,
    detailSubjectExaminee: detailSubjectExamineeReducer,
    examRoom: examRoomReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
