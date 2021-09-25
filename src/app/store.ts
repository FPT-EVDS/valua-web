import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import accountsReducer from 'features/account/accountsSlice';
import detailAccountReducer from 'features/account/detailAccountSlice';
import userReducer from 'features/auth/authSlice';
import detailRoomReducer from 'features/room/detailRoomSlice';
import roomsReducer from 'features/room/roomsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    account: accountsReducer,
    detailAccount: detailAccountReducer,
    room: roomsReducer,
    detailRoom: detailRoomReducer,
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
