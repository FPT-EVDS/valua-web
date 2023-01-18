import { createSlice } from '@reduxjs/toolkit';

interface DashboardState {
}

// Define the initial state using that type
const initialState: DashboardState = {
  
};

export const dashboardReducer = createSlice({
  name: 'manager',
  initialState,
  reducers: {},
  extraReducers: () => {

  },
});

export default dashboardReducer.reducer;
