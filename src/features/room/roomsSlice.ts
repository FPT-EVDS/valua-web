import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  isPending,
  isRejected,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import RoomDto from 'dtos/room.dto';
import RoomsDto from 'dtos/rooms.dto';
import RoomWithCamera from 'dtos/roomWithCamera.dto';
import SearchByNameDto from 'dtos/searchByName.dto';
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

export const searchByRoomName = createAsyncThunk(
  'rooms/searchByName',
  async (payload: SearchByNameDto, { rejectWithValue }) => {
    try {
      const response = await roomServices.searchRoomsByName(payload);
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
    rooms: [] as RoomWithCamera[],
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
      .addCase(addRoom.fulfilled, (state, action) => {
        if (state.current.currentPage === 0)
          state.current.rooms.unshift({ room: action.payload, camera: null });
        state.current.totalItems += 1;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(disableRoom.fulfilled, (state, action) => {
        const index = state.current.rooms.findIndex(
          roomWithCamera =>
            roomWithCamera.room.roomId === action.payload.roomId,
        );
        state.current.rooms[index].room.status = action.payload.status;
        state.error = '';
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(getRooms.fulfilled, searchByRoomName.fulfilled),
        (state, action) => {
          state.current = action.payload;
          state.error = '';
          state.isLoading = false;
        },
      )
      .addMatcher(isRejected, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addMatcher(isPending, state => {
        state.isLoading = true;
        state.error = '';
      });
  },
});

export default roomSlice.reducer;
