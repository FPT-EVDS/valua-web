import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import RoomDto from 'dtos/room.dto';
import RoomsDto from 'dtos/rooms.dto';
import Room from 'models/room.model';
import roomServices from 'services/room.service';

interface RoomState {
  isLoading: boolean;
  error: string;
  current: RoomsDto;
}

export const getRooms = createAsyncThunk(
  'rooms',
  async (numOfPage: number, { rejectWithValue }) => {
    try {
      const response = await roomServices.getRooms(numOfPage);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const addRoom = createAsyncThunk(
  'rooms/add',
  async (payload: RoomDto, { rejectWithValue }) => {
    try {
      const response = await roomServices.addRoom(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const disableRoom = createAsyncThunk(
  'rooms/disable',
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
const initialState: RoomState = {
  isLoading: false,
  error: '',
  current: {
    rooms: [] as Room[],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  },
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getRooms.fulfilled, (state, action) => {
        state.current = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(addRoom.fulfilled, (state, action) => {
        state.current.rooms.unshift(action.payload);
        state.error = '';
        state.isLoading = false;
      })
      .addCase(disableRoom.fulfilled, (state, action) => {
        const index = state.current.rooms.findIndex(
          room => room.roomId === action.payload.roomId,
        );
        state.current.rooms[index].status = action.payload.status;
        state.error = '';
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(getRooms.rejected, addRoom.rejected, disableRoom.rejected),
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        },
      )
      .addMatcher(
        isAnyOf(getRooms.pending, addRoom.pending, disableRoom.pending),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      );
  },
});

export default roomSlice.reducer;
