import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import accountsReducer from 'features/account/accountsSlice';
import detailAccountReducer from 'features/account/detailAccountSlice';
import userReducer from 'features/auth/authSlice';
import camerasReducer from 'features/camera/camerasSlice';
import detailCameraReducer from 'features/camera/detailCameraSlice';



export const store = configureStore({
  reducer: {
    user: userReducer,
    account: accountsReducer,
    detailAccount: detailAccountReducer,
    camera: camerasReducer,
    detailCamera: detailCameraReducer,
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
