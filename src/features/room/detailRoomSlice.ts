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
      .addCase(disableRoom.fulfilled, (state, action) => {
        if (state.room) state.room.status = action.payload.status;
      })
      .addMatcher(
        isAnyOf(getRoom.fulfilled, updateRoom.fulfilled),
        (state, action) => {
          state.room = action.payload;
          state.error = '';
          state.isLoading = false;
        },
      )
      .addMatcher(
        isAnyOf(getRoom.pending, updateRoom.pending, disableRoom.pending),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      )
      .addMatcher(
        isAnyOf(getRoom.rejected, updateRoom.rejected, disableRoom.rejected),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      );
  },
});

export default detailRoomSlice.reducer;
