import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import accountReducer from 'features/account/accountsSlice';
import detailAccountReducer from 'features/account/detailAccountSlice';
import userReducer from 'features/auth/authSlice';
import cameraReducer from 'features/camera/camerasSlice';
import detailCameraReducer from 'features/camera/detailCameraSlice';
import detailRoomReducer from 'features/room/detailRoomSlice';
import roomReducer from 'features/room/roomsSlice';
import semesterReducer from 'features/semester/semestersSlice';
import detailShiftReducer from 'features/shift/detailShiftSlice';
import shiftReducer from 'features/shift/shiftSlice';
import subjectReducer from 'features/subject/subjectsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    account: accountReducer,
    detailAccount: detailAccountReducer,
    room: roomReducer,
    detailRoom: detailRoomReducer,
    subjects: subjectReducer,
    semesters: semesterReducer,
    camera: cameraReducer,
    detailCamera: detailCameraReducer,
    shift: shiftReducer,
    detailShift: detailShiftReducer,
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
