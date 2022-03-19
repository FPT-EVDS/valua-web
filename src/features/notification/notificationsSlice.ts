import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import NotificationsDto from 'dtos/notifications.dto';
import SearchParams from 'dtos/searchParams.dto';
import Notification from 'models/notification.model';
import notificationServices from 'services/notification.service';

interface RoomState {
  isLoading: boolean;
  error: string;
  current: NotificationsDto;
  unreadNotifcations: number;
}

export const getNotifications = createAsyncThunk(
  'notifications',
  async (payload: SearchParams | undefined, { rejectWithValue }) => {
    try {
      const response = await notificationServices.getNotifications(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const getUnreadNotifications = createAsyncThunk(
  'notifications/unread',
  async (_payload, { rejectWithValue }) => {
    try {
      const response = await notificationServices.getUnreadNotifications();
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

// Define the initial state using that type
const initialState: RoomState = {
  isLoading: false,
  error: '',
  unreadNotifcations: 0,
  current: {
    notifications: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  },
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.current.notifications.unshift(action.payload);
      state.unreadNotifcations += 1;
    },
    resetUnreadNotification: state => {
      state.unreadNotifcations = 0;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.current = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(getUnreadNotifications.fulfilled, (state, action) => {
        state.unreadNotifcations = action.payload;
      })
      .addCase(getNotifications.pending, state => {
        state.error = '';
        state.isLoading = true;
      })
      .addCase(getNotifications.rejected, state => {
        state.error = '';
        state.isLoading = false;
      });
  },
});

export const { addNotification, resetUnreadNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;
