import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import RoomDto from 'dtos/room.dto';
import RoomWithCamera from 'dtos/roomWithCamera.dto';
import roomServices from 'services/room.service';

interface DetailRoomState {
  isLoading: boolean;
  error: string;
  roomWithCamera: RoomWithCamera | null;
  canAddCamera: boolean;
}

interface AddCameraRoomDto {
  roomId: string;
  cameraId: string;
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

export const addCameraToRoom = createAsyncThunk(
  'detailRoom/addCamera',
  async (payload: AddCameraRoomDto, { rejectWithValue }) => {
    try {
      const response = await roomServices.addCameraToRoom(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const removeCameraFromRoom = createAsyncThunk(
  'detailRoom/removeCamera',
  async (roomId: string, { rejectWithValue }) => {
    try {
      const response = await roomServices.removeCameraFromRoom(roomId);
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
  roomWithCamera: null,
  canAddCamera: true,
};

export const detailRoomSlice = createSlice({
  name: 'detailRoom',
  initialState,
  reducers: {
    enableAddCamera: state => {
      state.canAddCamera = true;
    },
    disableAddCamera: state => {
      state.canAddCamera = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(disableRoom.fulfilled, (state, action) => {
        if (state.roomWithCamera)
          state.roomWithCamera.room.status = action.payload.status;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(addCameraToRoom.fulfilled, (state, action) => {
        if (state.roomWithCamera) state.roomWithCamera.camera = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(removeCameraFromRoom.fulfilled, state => {
        if (state.roomWithCamera) state.roomWithCamera.camera = null;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(getRoom.fulfilled, (state, action) => {
        state.roomWithCamera = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        if (state.roomWithCamera) state.roomWithCamera.room = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(
          disableRoom.pending,
          addCameraToRoom.pending,
          removeCameraFromRoom.pending,
          getRoom.pending,
          updateRoom.pending,
        ),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      )
      .addMatcher(
        isAnyOf(
          disableRoom.rejected,
          addCameraToRoom.rejected,
          removeCameraFromRoom.rejected,
          getRoom.rejected,
          updateRoom.rejected,
        ),
        (state, action) => {
          state.isLoading = false;
          state.error = String(action.payload);
        },
      );
  },
});

export const { enableAddCamera, disableAddCamera } = detailRoomSlice.actions;

export default detailRoomSlice.reducer;
