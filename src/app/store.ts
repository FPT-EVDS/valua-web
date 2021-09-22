import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import userReducer from 'app/userSlice';
import accountReducer from 'features/account/accountSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    account: accountReducer,
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
