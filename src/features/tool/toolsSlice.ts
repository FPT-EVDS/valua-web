import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import SearchByNameDto from 'dtos/searchByName.dto';
import ToolDto from 'dtos/tool.dto';
import ToolsDto from 'dtos/tools.dto';
import Tool from 'models/tool.model';
import toolServices from 'services/tool.service';

interface ToolsState {
  isLoading: boolean;
  error: string;
  current: ToolsDto;
}

export const addTool = createAsyncThunk(
  'tools/add',
  async (payload: ToolDto, { rejectWithValue }) => {
    try {
      const response = await toolServices.addTool(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const updateTool = createAsyncThunk(
  'tools/update',
  async (payload: ToolDto, { rejectWithValue }) => {
    try {
      const response = await toolServices.updateTool(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const disableTool = createAsyncThunk(
  'tools/disable',
  async (toolId: string, { rejectWithValue }) => {
    try {
      const response = await toolServices.disableTool(toolId);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const activeTool = createAsyncThunk(
  'tools/active',
  async (toolId: string, { rejectWithValue }) => {
    try {
      const response = await toolServices.activeTool(toolId);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

export const searchByToolName = createAsyncThunk(
  'tools/searchByName',
  async (payload: SearchByNameDto, { rejectWithValue }) => {
    try {
      const response = await toolServices.searchTools(payload);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.response?.data);
    }
  },
);

// Define the initial state using that type
const initialState: ToolsState = {
  isLoading: false,
  error: '',
  current: {
    tools: [] as Tool[],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0,
  },
};

export const toolsSlice = createSlice({
  name: 'tool',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addTool.fulfilled, (state, action) => {
        if (state.current.currentPage === 0)
          state.current.tools.unshift(action.payload);
        state.current.totalItems += 1;
        state.error = '';
        state.isLoading = false;
      })
      .addCase(updateTool.fulfilled, (state, action) => {
        const index = state.current.tools.findIndex(
          tool => tool.toolId === action.payload.toolId,
        );
        state.current.tools[index] = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(disableTool.fulfilled, activeTool.fulfilled),
        (state, action) => {
          const index = state.current.tools.findIndex(
            tool => tool.toolId === action.payload.toolId,
          );
          state.current.tools[index].isActive = action.payload.isActive;
          state.error = '';
          state.isLoading = false;
        },
      )
      .addMatcher(isAnyOf(searchByToolName.fulfilled), (state, action) => {
        state.current = action.payload;
        state.error = '';
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(
          addTool.rejected,
          updateTool.rejected,
          disableTool.rejected,
          searchByToolName.rejected,
          activeTool.rejected,
        ),
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.error = action.payload;
        },
      )
      .addMatcher(
        isAnyOf(
          addTool.pending,
          updateTool.pending,
          disableTool.pending,
          searchByToolName.pending,
          activeTool.pending,
        ),
        state => {
          state.isLoading = true;
          state.error = '';
        },
      );
  },
});

export default toolsSlice.reducer;
