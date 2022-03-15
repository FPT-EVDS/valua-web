import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import accountReducer from 'features/account/accountsSlice';
import detailAccountReducer from 'features/account/detailAccountSlice';
import authReducer from 'features/auth/authSlice';
import addExamRoomReducer from 'features/examRoom/addExamRoomSlice';
import detailExamRoomReducer from 'features/examRoom/detailExamRoomSlice';
import examRoomReducer from 'features/examRoom/examRoomSlice';
import managerDashboardReducer from 'features/managerDashboard/managerDashboardSlice';
import notificationsReducer from 'features/notification/notificationsSlice';
import detailReportReducer from 'features/report/detailReportSlice';
import reportsReducer from 'features/report/reportsSlice';
import detailRoomReducer from 'features/room/detailRoomSlice';
import roomReducer from 'features/room/roomsSlice';
import detailSemesterReducer from 'features/semester/detailSemesterSlice';
import semesterReducer from 'features/semester/semestersSlice';
import detailShiftReducer from 'features/shift/detailShiftSlice';
import shiftReducer from 'features/shift/shiftSlice';
import shiftManagerDashboardReducer from 'features/shiftManagerDashboard/shiftManagerDashboardSlice';
import subjectReducer from 'features/subject/subjectsSlice';
import detailSubjectExamineeReducer from 'features/subjectExaminee/detailExamineeSubjectSlice';
import subjectExamineeReducer from 'features/subjectExaminee/subjectExamineeSlice';
import toolsReducer from 'features/tool/toolsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountReducer,
    detailAccount: detailAccountReducer,
    room: roomReducer,
    detailRoom: detailRoomReducer,
    subjects: subjectReducer,
    tools: toolsReducer,
    semesters: semesterReducer,
    detailSemester: detailSemesterReducer,
    shift: shiftReducer,
    detailShift: detailShiftReducer,
    subjectExaminee: subjectExamineeReducer,
    detailSubjectExaminee: detailSubjectExamineeReducer,
    examRoom: examRoomReducer,
    addExamRoom: addExamRoomReducer,
    detailExamRoom: detailExamRoomReducer,
    reports: reportsReducer,
    detailReport: detailReportReducer,
    shiftManagerDashboard: shiftManagerDashboardReducer,
    managerDashboard: managerDashboardReducer,
    notifications: notificationsReducer,
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
