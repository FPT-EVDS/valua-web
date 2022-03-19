import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import RoomDto from 'dtos/room.dto';
import Room from 'models/room.model';
import roomServices from 'services/room.service';

interface DetailRoomState {
  isLoading: boolean;
  error: string;
  room: Room | null;
}

export const getRoom = createAsyncThunk(
  'detailRoom/detail',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await roomServices.getRoom(id);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const updateRoom = createAsyncThunk(
  'detailRoom/update',
  async (payload: RoomDto, { rejectWithValue }) => {
    try {
      const response = await roomServices.updateRoom(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const disableRoom = createAsyncThunk(
  'detailRoom/disable',
  async (roomId: string, { rejectWithValue }) => {
    try {
      const response = await roomServices.disableRoom(roomId);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const enableRoom = createAsyncThunk(
  'detailRoom/enable',
  async (roomId: string, { rejectWithValue }) => {
    try {
      const response = await roomServices.enableRoom(roomId);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

// Define the initial state using that type
const initialState: DetailRoomState = {
  isLoading: false,
  error: '',
  room: null,
};

export const detailRoomSlice = createSlice({
  name: 'detailRoom',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getRoom.fulfilled, (state, action) => {
        state.room = action.payload.room;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        if (state.room) state.room = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(disableRoom.fulfilled, enableRoom.fulfilled),
        (state, action) => {
          if (state.room) state.room.status = action.payload.status;
          state.error = '';
          state.isLoading = false;
        },
      )
      .addMatcher(
        isAnyOf(
          disableRoom.pending,
          getRoom.pending,
          updateRoom.pending,
          enableRoom.pending,
        ),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      )
      .addMatcher(
        isAnyOf(
          disableRoom.rejected,
          getRoom.rejected,
          updateRoom.rejected,
          enableRoom.rejected,
        ),
        (state, action) => {
          state.isLoading = false;
          state.error = String(action.payload);
        },
      );
  },
});

export default detailRoomSlice.reducer;
