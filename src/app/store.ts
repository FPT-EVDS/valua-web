import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import authenticationReducer from '../features/authentication/authenticationReducer';

export const store = configureStore({
  reducer: {
    authentication: authenticationReducer,

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
